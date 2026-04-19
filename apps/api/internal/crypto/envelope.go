// Package crypto implements envelope encryption for broker credentials
// and other at-rest secrets (accounts.credentials_encrypted).
//
// Design:
//
//	KEK  — Key Encryption Key, 32 bytes AES-256, held in env/Doppler
//	       (prod moves to AWS KMS; credentials_kek_id tracks the KEK
//	       version for rotation).
//	DEK  — Data Encryption Key, 32 bytes AES-256, generated per record.
//
// Wire format written to BYTEA:
//
//	[ kekNonce(12) | encryptedDEK+tag(48) | dekNonce(12) | ciphertext+tag(N+16) ]
//
// So every ciphertext carries an overhead of 12+48+12+16 = 88 bytes.
//
// Plaintext is NEVER logged and this package never exposes DEKs beyond
// the narrow Encrypt/Decrypt surface.
package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
)

const (
	// KekIDCurrent is the short string stored alongside ciphertexts so we
	// can rotate KEKs without downtime.
	KekIDCurrent = "v1"

	dekBytes  = 32 // AES-256
	gcmNonce  = 12
	gcmTag    = 16
	encDEKLen = dekBytes + gcmTag // AES-GCM adds a 16-byte auth tag
	headerLen = gcmNonce + encDEKLen + gcmNonce
)

// Envelope holds the KEK in decoded form. Construct with New.
type Envelope struct {
	kekGCM cipher.AEAD
}

// New decodes a base64-encoded 32-byte KEK and returns an Envelope. The
// KEK length must be exactly 32 bytes after decoding (AES-256). Shorter
// KEKs are rejected rather than zero-padded.
func New(kekBase64 string) (*Envelope, error) {
	kek, err := base64.StdEncoding.DecodeString(kekBase64)
	if err != nil {
		return nil, fmt.Errorf("crypto: KEK not valid base64: %w", err)
	}
	if len(kek) != dekBytes {
		return nil, fmt.Errorf("crypto: KEK must be 32 bytes after base64 decode, got %d", len(kek))
	}

	block, err := aes.NewCipher(kek)
	if err != nil {
		return nil, fmt.Errorf("crypto: aes cipher: %w", err)
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("crypto: gcm: %w", err)
	}
	return &Envelope{kekGCM: gcm}, nil
}

// Encrypt wraps plaintext. An empty plaintext is valid and produces a
// non-empty ciphertext (the envelope header is always written).
func (e *Envelope) Encrypt(plaintext []byte) ([]byte, error) {
	// Fresh DEK per record.
	dek := make([]byte, dekBytes)
	if _, err := rand.Read(dek); err != nil {
		return nil, fmt.Errorf("crypto: dek rand: %w", err)
	}

	dekBlock, err := aes.NewCipher(dek)
	if err != nil {
		return nil, fmt.Errorf("crypto: aes(dek): %w", err)
	}
	dekGCM, err := cipher.NewGCM(dekBlock)
	if err != nil {
		return nil, fmt.Errorf("crypto: gcm(dek): %w", err)
	}

	// Encrypt plaintext with DEK.
	dekN := make([]byte, gcmNonce)
	if _, err := rand.Read(dekN); err != nil {
		return nil, fmt.Errorf("crypto: dek nonce: %w", err)
	}
	ct := dekGCM.Seal(nil, dekN, plaintext, nil)

	// Encrypt DEK with KEK.
	kekN := make([]byte, gcmNonce)
	if _, err := rand.Read(kekN); err != nil {
		return nil, fmt.Errorf("crypto: kek nonce: %w", err)
	}
	encDEK := e.kekGCM.Seal(nil, kekN, dek, nil)

	// Assemble wire format.
	out := make([]byte, 0, headerLen+len(ct))
	out = append(out, kekN...)
	out = append(out, encDEK...)
	out = append(out, dekN...)
	out = append(out, ct...)
	return out, nil
}

// Decrypt reverses Encrypt. Returns an error if the envelope was
// tampered with, truncated, or was encrypted under a different KEK.
func (e *Envelope) Decrypt(envelope []byte) ([]byte, error) {
	if len(envelope) < headerLen {
		return nil, errors.New("crypto: envelope truncated")
	}

	kekN := envelope[:gcmNonce]
	encDEK := envelope[gcmNonce : gcmNonce+encDEKLen]
	dekN := envelope[gcmNonce+encDEKLen : gcmNonce+encDEKLen+gcmNonce]
	ct := envelope[headerLen:]

	dek, err := e.kekGCM.Open(nil, kekN, encDEK, nil)
	if err != nil {
		return nil, fmt.Errorf("crypto: kek open: %w", err)
	}

	dekBlock, err := aes.NewCipher(dek)
	if err != nil {
		return nil, fmt.Errorf("crypto: aes(dek): %w", err)
	}
	dekGCM, err := cipher.NewGCM(dekBlock)
	if err != nil {
		return nil, fmt.Errorf("crypto: gcm(dek): %w", err)
	}
	pt, err := dekGCM.Open(nil, dekN, ct, nil)
	if err != nil {
		return nil, fmt.Errorf("crypto: dek open: %w", err)
	}
	return pt, nil
}

// MustGenerateKEKBase64 returns a fresh random 32-byte KEK, base64-encoded.
// Intended for `.env.example` / local dev setup and for tests. Panics on
// rand failure — that is not a recoverable condition.
func MustGenerateKEKBase64() string {
	kek := make([]byte, dekBytes)
	if _, err := rand.Read(kek); err != nil {
		panic(fmt.Errorf("crypto: rand: %w", err))
	}
	return base64.StdEncoding.EncodeToString(kek)
}

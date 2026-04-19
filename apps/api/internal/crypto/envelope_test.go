package crypto_test

import (
	"bytes"
	"encoding/base64"
	"strings"
	"testing"

	"github.com/rmstrn/investment-tracker/apps/api/internal/crypto"
)

func TestEnvelope_RoundTrip(t *testing.T) {
	env, err := crypto.New(crypto.MustGenerateKEKBase64())
	if err != nil {
		t.Fatalf("new: %v", err)
	}

	cases := [][]byte{
		nil,
		[]byte(""),
		[]byte("a"),
		[]byte("snaptrade_access_token_abc123"),
		bytes.Repeat([]byte("x"), 4096),
	}

	for _, plaintext := range cases {
		t.Run(truncateForName(plaintext), func(t *testing.T) {
			ct, err := env.Encrypt(plaintext)
			if err != nil {
				t.Fatalf("encrypt: %v", err)
			}
			pt, err := env.Decrypt(ct)
			if err != nil {
				t.Fatalf("decrypt: %v", err)
			}
			if !bytes.Equal(pt, plaintext) {
				t.Fatalf("roundtrip mismatch: got %q, want %q", pt, plaintext)
			}
		})
	}
}

func TestEnvelope_DifferentCiphertextsEachTime(t *testing.T) {
	env, err := crypto.New(crypto.MustGenerateKEKBase64())
	if err != nil {
		t.Fatalf("new: %v", err)
	}
	plaintext := []byte("same input")
	c1, _ := env.Encrypt(plaintext)
	c2, _ := env.Encrypt(plaintext)
	if bytes.Equal(c1, c2) {
		t.Fatal("two encryptions produced identical ciphertext — nonce reuse?")
	}
}

func TestEnvelope_TamperedCiphertextRejected(t *testing.T) {
	env, err := crypto.New(crypto.MustGenerateKEKBase64())
	if err != nil {
		t.Fatalf("new: %v", err)
	}
	ct, err := env.Encrypt([]byte("secret"))
	if err != nil {
		t.Fatalf("encrypt: %v", err)
	}
	// Flip one bit of the trailing ciphertext.
	ct[len(ct)-1] ^= 0x01
	if _, err := env.Decrypt(ct); err == nil {
		t.Fatal("decrypt accepted tampered ciphertext")
	}
}

func TestEnvelope_TruncatedEnvelopeRejected(t *testing.T) {
	env, err := crypto.New(crypto.MustGenerateKEKBase64())
	if err != nil {
		t.Fatalf("new: %v", err)
	}
	if _, err := env.Decrypt([]byte("too short")); err == nil {
		t.Fatal("decrypt accepted truncated envelope")
	}
}

func TestEnvelope_WrongKEKRejected(t *testing.T) {
	env1, _ := crypto.New(crypto.MustGenerateKEKBase64())
	env2, _ := crypto.New(crypto.MustGenerateKEKBase64())

	ct, err := env1.Encrypt([]byte("only env1 can read this"))
	if err != nil {
		t.Fatalf("encrypt: %v", err)
	}
	if _, err := env2.Decrypt(ct); err == nil {
		t.Fatal("decrypt with wrong KEK succeeded")
	}
}

func TestEnvelope_RejectsShortKEK(t *testing.T) {
	short := base64.StdEncoding.EncodeToString([]byte("too short kek"))
	if _, err := crypto.New(short); err == nil {
		t.Fatal("expected error for 13-byte KEK, got none")
	}
}

func TestEnvelope_RejectsInvalidBase64(t *testing.T) {
	if _, err := crypto.New("!!! not base64 !!!"); err == nil {
		t.Fatal("expected base64 error")
	}
}

// helper keeps sub-test names short in output.
func truncateForName(b []byte) string {
	s := string(b)
	if len(s) > 20 {
		return s[:20] + "..."
	}
	if s == "" {
		return "empty"
	}
	return strings.ReplaceAll(s, " ", "_")
}

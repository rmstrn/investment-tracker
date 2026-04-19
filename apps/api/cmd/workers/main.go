// Placeholder background worker process.
// TASK_04 / TASK_05 / TASK_06 will replace this with an asynq consumer
// handling broker sync, price refresh, daily portfolio snapshots, and insight generation.

package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	log.Println("workers: starting (placeholder — TASK_04 pending)")

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Tick once per 30s so the process is obviously alive in logs.
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-quit:
			log.Println("workers: shutting down")
			return
		case <-ticker.C:
			log.Println("workers: heartbeat (no jobs consumed — placeholder)")
		case <-ctx.Done():
			return
		}
	}
}

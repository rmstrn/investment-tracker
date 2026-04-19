.PHONY: help run-api run-workers build lint vet test tidy clean gen

help:
	@echo "Targets:"
	@echo "  run-api       Run the Core API server"
	@echo "  run-workers   Run the background worker process"
	@echo "  build         Build both binaries into ./bin"
	@echo "  gen           Regenerate sqlc code (internal/db/generated)"
	@echo "  lint          golangci-lint run"
	@echo "  vet           go vet ./..."
	@echo "  test          go test ./..."
	@echo "  tidy          go mod tidy"
	@echo "  clean         Remove build artifacts"

gen:
	go tool sqlc generate

run-api:
	go run ./cmd/api

run-workers:
	go run ./cmd/workers

build:
	mkdir -p bin
	go build -trimpath -o bin/api     ./cmd/api
	go build -trimpath -o bin/workers ./cmd/workers

lint:
	golangci-lint run ./...

vet:
	go vet ./...

test:
	go test -race -count=1 ./...

tidy:
	go mod tidy

clean:
	rm -rf bin

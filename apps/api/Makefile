.PHONY: help run-api run-workers build lint vet test tidy clean gen gen-db gen-api

OPENAPI_SRC  := ../../tools/openapi/openapi.yaml
OPENAPI_TMP  := /tmp/openapi.3.0.yaml

help:
	@echo "Targets:"
	@echo "  run-api       Run the Core API server"
	@echo "  run-workers   Run the background worker process"
	@echo "  build         Build both binaries into ./bin"
	@echo "  gen           Regenerate all codegen (sqlc + oapi-codegen)"
	@echo "  gen-db        Regenerate sqlc code only (internal/db/generated)"
	@echo "  gen-api       Regenerate oapi-codegen only (internal/api/gen)"
	@echo "  lint          golangci-lint run"
	@echo "  vet           go vet ./..."
	@echo "  test          go test ./..."
	@echo "  tidy          go mod tidy"
	@echo "  clean         Remove build artifacts"

gen: gen-db gen-api

gen-db:
	go tool sqlc generate

# gen-api: downgrade 3.1 → 3.0-style first (TD-007), then invoke oapi-codegen.
# The preprocessed spec is a build artifact — never committed, never a
# source of truth. The canonical spec stays at tools/openapi/openapi.yaml.
gen-api:
	go run ./codegen/preprocess -in $(OPENAPI_SRC) -out $(OPENAPI_TMP)
	go tool oapi-codegen -config codegen/config.yaml $(OPENAPI_TMP)
	rm -f $(OPENAPI_TMP)

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

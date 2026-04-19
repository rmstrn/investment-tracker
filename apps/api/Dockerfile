# Multi-stage Dockerfile for apps/api.
# Two final targets — `api` and `workers` — share the builder stage.
# Build one:
#   docker build --target api     -t investment-tracker-api     -f apps/api/Dockerfile apps/api
#   docker build --target workers -t investment-tracker-workers -f apps/api/Dockerfile apps/api
#
# docker-compose and Fly.io deploy pick the target via `target:` / `build.target`.

# -------- Stage 1: build --------
FROM golang:1.23-alpine AS builder

ENV CGO_ENABLED=0 \
    GOOS=linux \
    GO111MODULE=on

RUN apk add --no-cache git ca-certificates tzdata

WORKDIR /src

# Cache deps layer
COPY go.mod go.sum* ./
RUN go mod download || true

# Copy source
COPY . .

# Build both binaries — only the one we need per target is copied into the final stage
RUN go build -trimpath -ldflags="-s -w" -o /out/api     ./cmd/api     && \
    go build -trimpath -ldflags="-s -w" -o /out/workers ./cmd/workers

# -------- Stage 2: common runtime base --------
FROM alpine:3.23 AS runtime-base

RUN apk add --no-cache ca-certificates tzdata && \
    adduser -D -u 10001 app

USER app
WORKDIR /app

# -------- Stage 3: api --------
FROM runtime-base AS api

COPY --from=builder /out/api /app/api

EXPOSE 8080
ENTRYPOINT ["/app/api"]

# -------- Stage 4: workers --------
FROM runtime-base AS workers

COPY --from=builder /out/workers /app/workers

ENTRYPOINT ["/app/workers"]

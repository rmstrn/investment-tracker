# Multi-stage Dockerfile for apps/ai.
# Uses uv for fast, reproducible installs.
# Build: docker build -t investment-tracker-ai -f apps/ai/Dockerfile apps/ai

ARG PYTHON_VERSION=3.13

# -------- Stage 1: builder --------
FROM python:${PYTHON_VERSION}-slim AS builder

# Install uv from the official distroless image
COPY --from=ghcr.io/astral-sh/uv:0.5.11 /uv /usr/local/bin/uv

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/opt/venv

WORKDIR /src

# Cache dep resolution layer
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-install-project --no-dev || \
    uv sync --no-install-project --no-dev

# Copy source and install the project
COPY src ./src
COPY README.md ./
RUN uv sync --frozen --no-dev || \
    uv sync --no-dev

# -------- Stage 2: runtime --------
FROM python:${PYTHON_VERSION}-slim AS runtime

RUN useradd --create-home --uid 10001 app
USER app
WORKDIR /app

COPY --from=builder --chown=app:app /opt/venv /opt/venv
COPY --from=builder --chown=app:app /src /app

ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    AI_LISTEN_HOST=0.0.0.0 \
    AI_LISTEN_PORT=8000

EXPOSE 8000
CMD ["python", "-m", "ai_service.main"]

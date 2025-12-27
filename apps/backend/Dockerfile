FROM python:3.12-slim AS builder

WORKDIR /code

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy dependency files
COPY pyproject.toml ./

# Install dependencies
RUN uv sync --frozen --no-install-project --no-dev

# Copy source code
COPY src ./src
COPY alembic ./alembic
COPY alembic.ini ./

# Production image
FROM python:3.12-slim

WORKDIR /code

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy from builder
COPY --from=builder /code/.venv /code/.venv
COPY --from=builder /code/src ./src
COPY --from=builder /code/alembic ./alembic
COPY --from=builder /code/alembic.ini ./

# Add virtual environment to PATH
ENV PATH="/code/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

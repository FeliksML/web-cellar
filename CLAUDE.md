# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Start development (Docker with hot reload)
make dev

# Run all tests
make test

# Run backend tests only (inside Docker)
docker compose -f docker-compose.dev.yml exec backend pytest --cov=src tests/ -v

# Run a single backend test file
docker compose -f docker-compose.dev.yml exec backend pytest tests/test_auth.py -v

# Run frontend tests only
cd apps/frontend && pnpm run test

# Lint
make lint

# Format
make format

# Database migrations
make db-migrate                          # Apply migrations
make db-revision msg="description"       # Create new migration
```

## Architecture

This is a **monorepo** with Turborepo managing two applications:

### Backend (`apps/backend/`)
- **FastAPI** with async SQLAlchemy and Pydantic Settings
- **Domain-based structure**: Each feature (auth, health) is a self-contained module with `router.py`, `schemas.py`, `models.py`, `service.py`, `dependencies.py`
- Entry point: `src/main.py`
- Config loaded via `@lru_cache` in `src/config.py`
- Database session: async `get_db` dependency in `src/database.py`

### Frontend (`apps/frontend/`)
- **Vite + React 18 + TypeScript**
- **Feature-based structure**: Each feature in `src/features/` has `api/`, `components/`, `hooks/`, `stores/`, `types/`, and exports via `index.ts`
- **State management**: TanStack Query for server state, Zustand for client state
- Path alias: `@/` maps to `src/`
- API client with auth interceptor: `src/lib/api-client.ts`

### Key Patterns
- Frontend features export public API through `index.ts` barrel files
- Backend uses FastAPI `Depends()` for dependency injection
- Auth tokens stored in Zustand with localStorage persistence
- All API requests go through Axios instance with automatic Bearer token injection

## Environment

Development runs in Docker. The `docker-compose.dev.yml` mounts source directories for hot reload:
- Backend: uvicorn with `--reload`
- Frontend: Vite dev server
- Database: PostgreSQL 16

Frontend env vars must be prefixed with `VITE_` to be exposed to the browser.

## Design Rules

### Hero Section Background
- **ALWAYS** use `/hero_strawberry_bluberry.png` as the hero background - this is the official product photo with dark background
- **NEVER** use `background.png` or any plain brown/textured background - it has been deleted from the project
- **NEVER** split hero into separate background + product images - use the single combined hero image

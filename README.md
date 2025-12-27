# Web Cellar

Production-ready React + FastAPI monorepo boilerplate with JWT authentication.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **TanStack Query** for server state management
- **Zustand** for client state management
- **React Router v7** for routing
- **Tailwind CSS v4** for styling

### Backend
- **FastAPI** with Python 3.12+
- **SQLAlchemy** (async) for database ORM
- **Pydantic Settings** for configuration
- **Alembic** for database migrations
- **JWT Authentication** with python-jose

### Infrastructure
- **Docker** for containerization
- **PostgreSQL** for database
- **Turborepo** for monorepo management
- **pnpm** for package management
- **uv** for Python package management

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- pnpm 9+
- Python 3.12+ (for local development)
- uv (Python package manager)

### Setup

```bash
# Clone and install dependencies
pnpm install
cd apps/backend && uv sync && cd ../..

# Copy environment files
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Start development environment
make dev
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Project Structure

```
web-cellar/
├── apps/
│   ├── frontend/          # React + Vite application
│   │   ├── src/
│   │   │   ├── app/       # App shell, routes, providers
│   │   │   ├── features/  # Feature modules
│   │   │   ├── components/# Shared components
│   │   │   ├── lib/       # Utilities and API client
│   │   │   └── stores/    # Zustand stores
│   │   └── ...
│   └── backend/           # FastAPI application
│       ├── src/
│       │   ├── auth/      # Authentication module
│       │   ├── health/    # Health check module
│       │   ├── config.py  # Settings
│       │   ├── database.py# Database connection
│       │   └── main.py    # FastAPI app
│       ├── alembic/       # Database migrations
│       └── tests/
├── docker-compose.dev.yml # Development environment
├── docker-compose.yml     # Production environment
├── Makefile              # Developer commands
└── turbo.json            # Turborepo configuration
```

## Development Commands

```bash
# Start development environment
make dev

# Run tests
make test

# Run linters
make lint

# Generate TypeScript types from OpenAPI
make generate-client

# Run database migrations
make db-migrate

# Create new migration
make db-revision msg="add users table"

# View all commands
make help
```

## Authentication

The boilerplate includes a complete JWT authentication system:

### Backend Endpoints
- `POST /auth/register` - Create new user
- `POST /auth/login` - Get access token
- `GET /auth/me` - Get current user (protected)

### Frontend Features
- Login and registration forms
- Auth state persistence with Zustand
- Protected route component (`AuthGuard`)
- Automatic token injection via Axios interceptors

## Architecture Patterns

### Feature-Based Organization
Both frontend and backend use feature/domain-based organization for better maintainability:

```typescript
// Frontend feature module
features/auth/
├── api/          # TanStack Query hooks
├── components/   # Feature-specific components
├── hooks/        # Custom hooks
├── stores/       # Zustand stores
├── types/        # TypeScript types
└── index.ts      # Public API
```

```python
# Backend domain module
src/auth/
├── router.py      # API endpoints
├── schemas.py     # Pydantic models
├── models.py      # SQLAlchemy models
├── service.py     # Business logic
└── dependencies.py# FastAPI dependencies
```

### State Management
- **Server State**: TanStack Query for API data with caching
- **Client State**: Zustand for UI state (theme, sidebar, auth)

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/webcellar
SECRET_KEY=your-super-secret-key
ENVIRONMENT=development
BACKEND_CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Web Cellar
```

## License

MIT

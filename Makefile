.PHONY: dev dev-build stop logs test lint format generate-client db-migrate db-revision clean help

# Development
dev: ## Start development environment
	docker compose -f docker-compose.dev.yml up

dev-build: ## Build and start development environment
	docker compose -f docker-compose.dev.yml up --build

stop: ## Stop all containers
	docker compose -f docker-compose.dev.yml down

logs: ## View container logs
	docker compose -f docker-compose.dev.yml logs -f

# Testing
test: ## Run all tests
	docker compose -f docker-compose.dev.yml exec backend pytest --cov=src tests/
	cd apps/frontend && pnpm run test

test-backend: ## Run backend tests only
	docker compose -f docker-compose.dev.yml exec backend pytest --cov=src tests/ -v

test-frontend: ## Run frontend tests only
	cd apps/frontend && pnpm run test

# Linting and Formatting
lint: ## Run linters
	docker compose -f docker-compose.dev.yml exec backend ruff check src/
	cd apps/frontend && pnpm run lint

format: ## Format code
	docker compose -f docker-compose.dev.yml exec backend ruff format src/
	cd apps/frontend && pnpm exec prettier --write "src/**/*.{ts,tsx}"

# Type Generation
generate-client: ## Generate TypeScript types from OpenAPI
	cd apps/frontend && pnpm run generate-client

# Database
db-migrate: ## Run database migrations
	docker compose -f docker-compose.dev.yml exec backend alembic upgrade head

db-revision: ## Create a new migration (usage: make db-revision msg="description")
	docker compose -f docker-compose.dev.yml exec backend alembic revision --autogenerate -m "$(msg)"

db-downgrade: ## Downgrade database by one revision
	docker compose -f docker-compose.dev.yml exec backend alembic downgrade -1

# Setup
setup: ## Initial project setup
	pnpm install
	cd apps/backend && uv sync
	cp .env.example .env
	cp apps/backend/.env.example apps/backend/.env
	cp apps/frontend/.env.example apps/frontend/.env

# Cleanup
clean: ## Clean up generated files and containers
	docker compose -f docker-compose.dev.yml down -v
	rm -rf apps/frontend/node_modules apps/frontend/dist
	rm -rf apps/backend/.venv apps/backend/__pycache__
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true

# Production
build: ## Build production images
	docker compose build

prod: ## Start production environment
	docker compose up -d

# Help
help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  %-15s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Default target
.DEFAULT_GOAL := help

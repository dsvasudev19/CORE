.PHONY: help install dev build clean test lint format db-up db-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	pnpm install

dev: ## Start all services in development mode
	pnpm dev

dev-webapp: ## Start only the webapp
	pnpm dev:webapp

dev-core: ## Start only the core service
	pnpm dev:core

dev-messaging: ## Start only the messaging service
	pnpm dev:messaging

dev-services: ## Start all backend services
	pnpm dev:services

build: ## Build all apps
	pnpm build

clean: ## Clean all build artifacts and dependencies
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf services/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf .turbo
	rm -rf apps/*/dist
	rm -rf apps/*/.next
	cd services/core-service && ./mvnw clean

test: ## Run all tests
	pnpm test

lint: ## Lint all code
	pnpm lint

format: ## Format all code
	pnpm format

db-up: ## Start database containers
	docker-compose up -d mysql

db-down: ## Stop database containers
	docker-compose down

db-migrate: ## Run database migrations
	cd services/messaging-service && pnpm db:migrate

db-seed: ## Seed databases
	cd services/messaging-service && pnpm db:seed

setup: install db-up ## Complete setup (install + start databases)
	@echo "Waiting for database to be ready..."
	@sleep 10
	@make db-migrate
	@make db-seed
	@echo "Setup complete! Run 'make dev' to start all services"

logs: ## Show docker logs
	docker-compose logs -f

ps: ## Show running services
	docker-compose ps

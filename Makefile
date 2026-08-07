.PHONY: up down build rebuild logs status ps \
        build-backend build-frontend build-dashboard

# ── Full stack ────────────────────────────────────────────────
up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build --no-cache

rebuild:
	docker compose down
	docker compose build --no-cache
	docker compose up -d

# ── Individual builds ─────────────────────────────────────────
build-backend:
	docker compose build --no-cache backend
	docker compose up -d backend

build-frontend:
	docker compose build --no-cache frontend
	docker compose up -d frontend

build-dashboard:
	docker compose build --no-cache dashboard
	docker compose up -d dashboard

# ── Monitoring ────────────────────────────────────────────────
logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-dashboard:
	docker compose logs -f dashboard

status:
	docker compose ps

ps: status

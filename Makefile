.PHONY: deploy build-bg build-fg build-dash logs status down ps \
        rebuild up

# ── Full deploy ───────────────────────────────────────────────
deploy:
	git pull origin dev
	docker compose build --no-cache
	docker compose up -d

rebuild:
	docker compose down
	docker compose build --no-cache
	docker compose up -d

up:
	docker compose up -d

down:
	docker compose down

# ── Individual builds ─────────────────────────────────────────
build-bg:
	git pull origin dev
	docker compose build --no-cache backend
	docker compose up -d backend

build-fg:
	git pull origin dev
	docker compose build --no-cache frontend
	docker compose up -d frontend

build-dash:
	git pull origin dev
	docker compose build --no-cache dashboard
	docker compose up -d dashboard

# ── Monitoring ────────────────────────────────────────────────
status:
	docker compose ps

ps: status

logs:
	docker compose logs -f

logs-bg:
	docker compose logs -f backend

logs-fg:
	docker compose logs -f frontend

logs-dash:
	docker compose logs -f dashboard

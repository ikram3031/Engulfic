.PHONY: deploy build-fg logs status down ps rebuild up

# ── Full deploy ───────────────────────────────────────────────
deploy:
	git pull origin live
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
build-fg:
	git pull origin live
	docker compose build --no-cache frontend
	docker compose up -d frontend

# ── Monitoring ────────────────────────────────────────────────
status:
	docker compose ps

ps: status

logs:
	docker compose logs -f

logs-fg:
	docker compose logs -f frontend

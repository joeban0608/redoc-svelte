.PHONY: clear
clear:
	docker compose down -v

.PHONY: local
local:
	docker compose up -d
	npx drizzle-kit studio


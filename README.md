TaskTool server - scaffold

Quick start (local/docker):

1. Copy `.env.example` -> `.env` and adjust values if needed.
2. npm ci
3. npx prisma generate --schema=server/prisma/schema.prisma
4. npm run build
5. Run locally: `npm start` or use docker-compose (recommended):

	```bash
	cd tasktool-server
	docker-compose up -d --build
	curl http://localhost:3000/api/health
	```

Troubleshooting:

- If containers try to connect to `127.0.0.1` for Redis/Postgres, ensure you use the compose stack defaults or set `DATABASE_URL`/`REDIS_URL` to the service hostnames (e.g. `postgres`, `redis`).
- If you get Prisma native engine errors inside containers, the Dockerfile uses a Debian-based node image so OpenSSL is available; rebuild images after changes.
- To free host ports (5432/6379/3000) stop local services or change compose port mappings in `docker-compose.yml`.

Worker: `npm run worker` or containerized via docker-compose (service `worker`).

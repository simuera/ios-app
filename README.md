## License

**This repository is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).**

You may read, fork, and use the code for **personal, educational, or evaluation purposes only**.  
**Commercial use, redistribution, resale, or inclusion in paid products/services is strictly prohibited** without written permission from the copyright holder (Emir Alakus).

If you want to request a commercial license or discuss usage rights, contact: **emirabdullah2007@gmail.com**

> 🔒 **Notice:** This project is provided for transparency and portfolio demonstration only.  
> Viewing and learning from the code is allowed — **using any part of it in commercial or monetized products is not permitted** without a signed license agreement.

See the full [LICENSE.md](./LICENSE.md) for complete terms.


u gotta download node

Quick start (local/docker):

1. Copy `.env.example` -> `.env` and adjust values if needed.
2. npm ci
3. npm install
4. npx prisma generate --schema=server/prisma/schema.prisma
5. npm run build
6. Run locally: `npm start` or use docker-compose (recommended):

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

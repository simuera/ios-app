## Developer Makefile for common tasks

SHELL := /bin/bash

.PHONY: help install build start test smoke compose-up compose-down prisma-generate prisma-migrate

help:
	@echo "Makefile commands:"
	@echo "  make install         # install node deps (npm install)"
	@echo "  make build           # tsc build"
	@echo "  make start           # start app (pm2-runtime)"
	@echo "  make test            # run unit tests"
	@echo "  make smoke           # run docker-compose smoke script"
	@echo "  make compose-up      # docker-compose up -d --build"
	@echo "  make compose-down    # docker-compose down"
	@echo "  make prisma-generate # npx prisma generate"
	@echo "  make prisma-migrate  # npx prisma migrate deploy (or db push)"

install:
	npm install

build:
	npm run build

start:
	pm2-runtime ecosystem.config.js

test:
	npm test

smoke:
	./scripts/smoke.sh

compose-up:
	docker-compose up -d --build

compose-down:
	docker-compose down --volumes --remove-orphans

prisma-generate:
	npx prisma generate --schema=server/prisma/schema.prisma

prisma-migrate:
	npx prisma migrate deploy || npx prisma db push --schema=server/prisma/schema.prisma

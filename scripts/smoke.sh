#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

echo "Starting docker-compose stack (smoke)..."
docker-compose up -d --build

echo "Waiting for API to be healthy..."
for i in {1..30}; do
  if curl -fsS http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "API healthy"
    docker-compose ps
    exit 0
  fi
  sleep 1
done

echo "API failed to become healthy"
docker-compose logs --tail=200
exit 1

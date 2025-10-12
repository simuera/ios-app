# Contributing and Local Development

Quick commands:

- Install deps: `make install`
- Build: `make build`
- Run unit tests: `make test`
- Run smoke stack: `make smoke`
- Start compose stack: `make compose-up`
- Tear down stack: `make compose-down`

Integration test notes

- To run integration tests locally:

  ```bash
  make compose-up
  export DATABASE_URL=postgresql://tasktool:password@localhost:5432/tasktool
  export REDIS_URL=redis://localhost:6379
  export RUN_INTEGRATION=true
  npm test
  ```

CI notes

- CI workflows run lint, build and tests. Integration tests are run in `ci-integration.yml` which starts docker-compose with `docker-compose.ci.yml` to expose ports to the runner.



# StackCheck local quiz

A local full-stack quiz application with a Next.js BFF, Ktor API, and a persistent SQLite database. The shared question bank starts with ten English questions and can be extended from the UI. Quiz sessions and results remain in browser memory only.

## Stack

- Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS, Vitest, and React Testing Library
- Handwritten OpenAPI 3.1 contract with a HeyAPI-generated fetch client
- Ktor 3 with Kotlin serialization, Exposed DSL, HikariCP, and Flyway
- SQLite file database for local development
- JUnit 5 integration tests using temporary SQLite databases
- Java 21 through the Gradle toolchain and Gradle Wrapper 9.7.1
- Node.js 22.22.2 and pnpm 11.25.0 pinned through Volta

## Prerequisites

- [Volta](https://volta.sh/)

No global Gradle, Java 21, Node.js, or pnpm installation is required. Gradle downloads the Java 21 toolchain when necessary, while Volta installs and selects the frontend tools pinned in `frontend/package.json`.

## Run locally

Run commands from the repository root unless a step says otherwise.

1. Create the repository-root `.env` file with the SQLite and Ktor settings. The Ktor `run` task and Next.js load this file automatically.

2. Start Ktor on the host in terminal one. Startup creates `backend/data/quiz.db` if absent, then Flyway migrates and seeds it before Exposed is used.

   ```bash
   cd backend
   ./gradlew run
   ```

3. Install frontend dependencies and regenerate the client in terminal two. HeyAPI always reads `openapi/quiz-api.yaml`; files under `frontend/src/generated/` are generated and must not be edited manually.

   ```bash
   cd frontend
   volta run pnpm install --frozen-lockfile
   volta run pnpm api:generate
   ```

4. Start Next.js on the host. `KTOR_BASE_URL` is read only by server-side Route Handlers and is never exposed as a `NEXT_PUBLIC_*` variable.

   ```bash
   cd frontend
   volta run pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

6. Stop the frontend and backend with `Ctrl+C`. The SQLite file preserves questions between runs. Delete `backend/data/quiz.db` when intentionally resetting local quiz data.

## API generation

The handwritten contract is `openapi/quiz-api.yaml`. After changing it, regenerate and check in the resulting client and types:

```bash
cd frontend
volta run pnpm api:generate
volta run pnpm typecheck
```

The browser calls only `GET /api/quiz` and `POST /api/questions` on Next.js. Those thin BFF handlers use the generated client to call Ktor at `GET /api/v1/quiz` and `POST /api/v1/questions`, preserve meaningful status codes, and normalize transport or malformed-response failures.

## Tests and checks

Backend unit and API integration tests use the Gradle Wrapper. Each integration test creates a temporary SQLite database and applies the real migration; Docker is not required.

```bash
cd backend
./gradlew test
```

Frontend tests run once:

```bash
cd frontend
volta run pnpm test:run
```

Frontend tests in watch mode:

```bash
cd frontend
volta run pnpm test
```

Lint, type-check, and production-build the frontend:

```bash
cd frontend
volta run pnpm lint
volta run pnpm typecheck
volta run pnpm build
```

## Repository layout

```text
backend/                 Ktor application, migration, and tests
frontend/                Next.js application, BFF, generated client, and tests
openapi/quiz-api.yaml    Handwritten source-of-truth API contract
.env                     Local settings shared by host processes
backend/data/            Persistent local SQLite database, ignored by Git
```

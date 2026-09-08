# StackCheck local quiz

> **Workshop:** Start med [`oppgaver/README.md`](oppgaver/README.md) for den workshopen om agentisk AI-oppsett med OpenCode.

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

For the full workshop, including the Chrome DevTools MCP exercise, install or have access to:

- [OpenCode](https://opencode.ai/)
- [Volta](https://volta.sh/)
- The current stable version of [Google Chrome](https://www.google.com/chrome/)
- A model provider account, such as GitHub Copilot, OpenAI, Anthropic, or Google
- This repository and a repository-root `.env` file supplied by the facilitator

### macOS installation

The following commands use Homebrew. Skip the Homebrew installation if it is already available:

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install OpenCode and Chrome
brew install anomalyco/tap/opencode
brew install --cask google-chrome

# Install Volta, then start a new login shell
curl https://get.volta.sh | bash
exec zsh -l

# Make Node and npx available from the repository root for the MCP server
volta install node@22.22.2
```

Verify the installations:

```bash
opencode --version
volta --version
node --version
npx --version
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --version
```

The project pins Node.js `22.22.2` and pnpm `11.25.0` in `frontend/package.json`. You do not need to install pnpm globally; Volta selects the pinned version when commands are run from `frontend/`. Chrome DevTools MCP is also not installed globally; `npx` downloads it when OpenCode starts the configured server.

If you do not want to use Homebrew for OpenCode, use the official installer instead:

```bash
curl -fsSL https://opencode.ai/install | bash
```

Java 21, Gradle, Docker, and a global pnpm installation are not required. The Gradle Wrapper and Volta handle the project tooling. Git is only needed to clone the repository; if Git is missing on macOS, install the Command Line Tools with `xcode-select --install`.

## Before the workshop

Authenticate OpenCode and install the project dependencies before the session:

```bash
opencode auth list
opencode auth login # only if the required provider is missing

cd /path/to/effektiv-AI-workshop/frontend
volta run pnpm install --frozen-lockfile
volta run pnpm api:generate
```

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

# Løsningsforslag og refleksjon: ekstraoppgaver

## A. Skills og plugins fra fellesskapet

Det finnes ikke én riktig kombinasjon. Et godt forsøk etablerer en baseline, tester én endring om gangen og kontrollerer faktisk effekt.

- En skill består hovedsakelig av instrukser som Claude kan laste ved behov.
- En Claude Code-plugin kan distribuere skills, subagenter, hooks og MCP-servere samlet.
- En MCP-server er en separat integrasjon som tilbyr verktøy eller data gjennom en protokoll.
- Kildekontroll, versjonslåsing, minst mulig tilgang og testing uten hemmeligheter reduserer risiko.
- Flere funksjoner kan gi mer støy, større angrepsflate og mer kontekst.

Skill passer når effekten kan oppnås med instrukser og modellens skjønn. Plugin passer når flere Claude Code-komponenter skal distribueres sammen. MCP passer når agenten trenger et avgrenset verktøy eller en ekstern datakilde.

## B. Review my changes

En mulig `.claude/skills/review-my-changes/SKILL.md`:

```markdown
---
name: review-my-changes
description: Gjennomgå mine ucommittede endringer med korte, konkrete forbedringsforslag.
disable-model-invocation: true
context: fork
agent: Explore
background: false
disallowed-tools: Edit, Write, NotebookEdit
---

## Git-status

!`git status --short`

## Unstaged diff

!`git diff --`

## Staged diff

!`git diff --cached --`

Gjennomgå alle ucommittede endringer, inkludert nye filer fra statusen. Les nye filer separat. Ekstra fokus fra brukeren: $ARGUMENTS

Ikke endre filer eller implementer forslag. Vurder korrekthet, tydelighet, vedlikeholdbarhet og manglende tester. Prioriter maksimalt fem konkrete forbedringer.

Svar med kort oppsummering, viktigste forbedringer med alvorlighetsgrad og filreferanse, ett eller to gode grep og prioriterte neste steg. Hvis du ikke finner forbedringspunkter, si det tydelig og nevn testområder du ikke kunne verifisere.
```

`context: fork` holder reviewdetaljene ute av hovedkonteksten. `agent: Explore` bruker den innebygde skrivebeskyttede agenten. `background: false` gjør at brukeren får resultatet i samme arbeidsflyt. `disallowed-tools` fjerner direkte skriveverktøy i tillegg.

Dynamisk kontekst kjøres før Claude ser skillen. Nye filer vises i status, men ikke i vanlig diff, så agenten må lese dem separat.

## C. Kontekst og kostnad

Det finnes ikke ett forventet tall. Modell, effort, cache, kontotype og variasjon mellom kjøringer påvirker resultatet. `/context` viser hva som opptar kontekstvinduet, mens `/usage` viser den bruksinformasjonen kontoen tilbyr. `/cost` er et alias i nyere Claude Code. For abonnement er dette ikke nødvendigvis en fakturert dollarkostnad.

Se etter disse avveiningene:

- Fast kontekst passer for korte, stabile regler med høy konsekvens.
- Skills reduserer grunnkonteksten, men krever presis aktivering.
- Subagenter isolerer detaljer, men delegering sender ny input og produserer ny output.
- Færre verktøykall og kortere output kan bety mer enn modellens listepris.
- Cache gjør ikke irrelevant kontekst ufarlig.

En sjelden regel bør bare flyttes fra `CLAUDE.md` hvis den gjelder skillens arbeidsområde. Globale regler bør bli værende.

## D. Custom tool med MCP

Opprett `.claude/mcp/quiz-tools/package.json`:

```json
{
  "name": "quiz-tools-mcp",
  "private": true,
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "1.29.0",
    "zod": "^3.25.0"
  }
}
```

Installer avhengighetene fra riktig mappe:

```bash
cd .claude/mcp/quiz-tools
npm install
```

I et delt produksjonsoppsett bør også lockfila committes.

Opprett `.claude/mcp/quiz-tools/index.mjs`:

```javascript
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

const server = new McpServer({ name: "quiz-tools", version: "1.0.0" })

server.registerTool(
  "count_quiz_questions",
  {
    description: "Tell quizspørsmål som opprettes av den første databasemigreringen",
    inputSchema: {},
  },
  async () => {
    const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
    const migration = await readFile(
      resolve(projectDir, "backend/src/main/resources/db/migration/V1__init_schema_and_seed.sql"),
      "utf8",
    )
    const insert = migration.match(/INSERT INTO questions[\s\S]*?;/i)
    const count = insert?.[0].split("\n").filter((line) => /^\s*\('/.test(line)).length ?? 0

    return {
      content: [{ type: "text", text: `Den første migreringen oppretter ${count} quizspørsmål.` }],
    }
  },
)

await server.connect(new StdioServerTransport())
```

Legg denne serveroppføringen inn under den eksisterende `mcpServers`-blokka i `.mcp.json`. Behold `chrome-devtools` og andre servere som allerede ligger der:

```json
"quiz-tools": {
  "type": "stdio",
  "command": "node",
  "args": [
    "${CLAUDE_PROJECT_DIR:-.}/.claude/mcp/quiz-tools/index.mjs"
  ]
}
```

Med dagens migrering svarer verktøyet **10 quizspørsmål**. Regexen er formatavhengig; en produksjonsløsning bør parse SQL eller migrere en tom database. En eksisterende utviklingsdatabase er feil sannhetskilde fordi brukeren kan ha lagt til spørsmål.

MCP-verktøyet har en smal kontrakt, men blir først en reell sikkerhetsgrense når agenten heller ikke har fri Bash- eller filtilgang til de samme dataene.

## E. Hooks og kvalitetsport

Prosjektets `.claude/settings.json` har riktig registrering:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/quality-gate.mjs\"",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

Behold eksisterende settingsnøkler når du redigerer fila.

### Del A

```javascript
let raw = ""
for await (const chunk of process.stdin) raw += chunk

const input = JSON.parse(raw)
console.error(`[quality-gate] ${input.tool_name} endret arbeidsområdet`)
```

### Del B

```javascript
import { spawnSync } from "node:child_process"
import { isAbsolute, relative, resolve, sep } from "node:path"

let raw = ""
for await (const chunk of process.stdin) raw += chunk

const input = JSON.parse(raw)
const changedPath = input.tool_input?.file_path
if (typeof changedPath !== "string") process.exit(0)

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const frontendRoot = resolve(projectDir, "frontend")
const absolutePath = isAbsolute(changedPath) ? changedPath : resolve(projectDir, changedPath)
const frontendPath = relative(frontendRoot, absolutePath)

if (
  frontendPath === ".." ||
  frontendPath.startsWith(`..${sep}`) ||
  isAbsolute(frontendPath) ||
  !/\.(js|jsx|mjs|ts|tsx)$/.test(frontendPath)
) process.exit(0)

console.error(`[quality-gate] sjekker ${frontendPath}`)
const result = spawnSync(
  "volta",
  ["run", "pnpm", "eslint", "--", frontendPath],
  { cwd: frontendRoot, encoding: "utf8" },
)

if (result.status !== 0) {
  process.stderr.write(result.stdout ?? "")
  process.stderr.write(result.stderr ?? "")
  process.exit(2)
}
```

Argumentarrayen unngår shell-injeksjon fra filstien. Claude Code tolker exitkode `2` fra en `PostToolUse`-hook som blokkerende feedback til Claude, men redigeringen er allerede utført.

Rask lint etter hver endring gir tidlig feedback, men kan bli tregt og støyende. `PostToolBatch` eller `Stop` passer bedre for samlet kontroll. Automatisk formatering kan skjule hva agenten endret; rapportering er ofte et tryggere utgangspunkt. En hook passer når reaksjonen skal skje deterministisk, mens `CLAUDE.md` passer når Claude må vurdere kontekst og hensikt.

# Løsningsforslag og refleksjon: ekstraoppgaver

## A. Kontekst og kostnad

Det finnes ikke ett forventet tall; modell, leverandør og cache påvirker resultatet. Se etter disse avveiningene:

- Fast kontekst passer for korte, stabile regler med høy konsekvens.
- Skills reduserer normal grunnkontekst, men krever at beskrivelsen gjør aktiveringen pålitelig.
- Subagenter isolerer spesialarbeid, men delegering sender ny input og produserer ny output.
- Kortere output og færre unødvendige verktøykall kan være vel så viktig som en billigere modell.
- En liten modell er ikke billig dersom den må prøve fem ganger; en dyr modell er ikke effektiv dersom oppgaven er mekanisk.

## B. Command

`.opencode/commands/contract-check.md`:

```markdown
---
description: Kjør en skrivebeskyttet kontroll av samsvar i API-kontrakten.
agent: contract-reviewer
subtask: true
---

Kontroller samsvar i API-kontrakten for dette omfanget: $ARGUMENTS

Sammenlign sannhetskilden i OpenAPI, Ktor-implementasjonen og Next.js BFF. Ikke endre filer. Returner funn sortert etter alvorlighetsgrad med filreferanser, etterfulgt av manglende tester. Si tydelig fra dersom det ikke finnes funn.
```

`subtask: true` isolerer kjøringen som en underoppgave. Commanden gjør starten eksplisitt og repeterbar; agentfilen eier fortsatt rollen og permissions.

## C. Custom tool

En mulig `.opencode/plugins/quiz-tools.ts`:

```typescript
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { type Plugin, tool } from "@opencode-ai/plugin"

export const QuizTools = (async ({ worktree }) => ({
  tool: {
    count_quiz_questions: tool({
      description: "Tell quizspørsmålene som opprettes av den første databasemigreringen",
      args: {},
      async execute() {
        const migration = await readFile(
          resolve(worktree, "backend/src/main/resources/db/migration/V1__init_schema_and_seed.sql"),
          "utf8",
        )
        const match = migration.match(/INSERT INTO questions[\s\S]*?;/i)
        const count =
          match?.[0].split("\n").filter((line) => /^\s*\('/.test(line)).length ?? 0
        return `Den første migreringen oppretter ${count} quizspørsmål.`
      },
    }),
  },
})) satisfies Plugin
```

En robust produksjonsløsning burde parse SQL eller spørre databasen. Her er poenget verktøygrensen: modellen får et smalere, navngitt alternativ til shell. For at dette også skal være en sikkerhetsgrense, må verktøyet gis til en agent som har `bash: deny` og bare de øvrige permissions den trenger.

## D. Hooks og kvalitetsport

### Del A

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const QualityGate = (async () => {
  return {
    "tool.execute.after": async (input) => {
      if (["edit", "write", "apply_patch"].includes(input.tool)) {
        console.log(`[quality-gate] ${input.tool} endret arbeidsområdet`)
      }
    },
  }
}) satisfies Plugin
```

### Del B

```typescript
import { isAbsolute, relative, resolve } from "node:path"
import type { Plugin } from "@opencode-ai/plugin"

export const QualityGate = (async ({ $, worktree }) => {
  return {
    "tool.execute.after": async (input) => {
      if (!["edit", "write", "apply_patch"].includes(input.tool)) return

      const frontendRoot = resolve(worktree, "frontend")
      const directPath = input.args.filePath ?? input.args.path
      const patchPaths =
        typeof input.args.patchText === "string"
          ? [...input.args.patchText.matchAll(/^\*\*\* (?:Add|Update) File: (.+)$/gm)].map(
              ([, path]) => path,
            )
          : []
      const changedPaths = typeof directPath === "string" ? [directPath] : patchPaths

      for (const changedPath of changedPaths) {
        const absolutePath = isAbsolute(changedPath)
          ? changedPath
          : resolve(worktree, changedPath)
        const frontendPath = relative(frontendRoot, absolutePath)

        if (frontendPath.startsWith("..") || isAbsolute(frontendPath)) continue
        if (!/\.(js|jsx|mjs|ts|tsx)$/.test(frontendPath)) continue

        console.log(`[quality-gate] sjekker ${frontendPath}`)
        const result = await $`volta run pnpm eslint ${frontendPath}`
          .cwd(frontendRoot)
          .nothrow()
        if (result.exitCode !== 0) {
          console.warn(`[quality-gate] lint feilet for ${frontendPath}`)
        }
      }
    },
  }
}) satisfies Plugin
```

Denne løsningen henter alle `Add`- og `Update`-filer fra en patch. En produksjonsvariant burde også håndtert flytting og sletting, samlet duplikater og reagert på formatet til verktøyversjonen som faktisk er installert.

### Produksjonsstrategi

Automatisk lint etter hver filendring gir rask feedback, men kan bli tregt og støyende. `.nothrow()` hindrer at en lintfeil gjør et allerede fullført edit-kall til en verktøyfeil. Et vanlig kompromiss er å samle endrede filer og kjøre sjekken ved `session.idle`, eller la hooken bare logge/påminne og kjøre full sjekk én gang før agenten avslutter.

Det finnes ikke ett riktig svar på om hooken bør formatere eller bare rapportere. Automatisk formatering kan holde arbeidsområdet ryddig, men kan også skjule hva agenten endret eller skape nye endringer mellom to steg. En hook passer best når reaksjonen må skje hver gang og kan gjøres forutsigbart; en `AGENTS.md`-instruks passer bedre når agenten må vurdere kontekst og hensikt.

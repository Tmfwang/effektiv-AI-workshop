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

## D. MCP

Ingen felles fasit er trygg fordi MCP-servere har ulik installasjon og autentisering. En god løsning bør kunne svare ja på dette:

- Er utgiver og pakkeversjon vurdert?
- Er serverens verktøy begrenset til agentene som trenger dem?
- Er hemmeligheter hentet fra miljøet, ikke skrevet i repoet?
- Vet deltakeren hvilke data som sendes ut av maskinen?
- Kan integrasjonen deaktiveres uten å slette oppsettet?

MCP er en protokoll for eksterne kapabiliteter, ikke et kvalitetsstempel på serveren.

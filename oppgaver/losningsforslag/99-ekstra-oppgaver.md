# Løsningsforslag og refleksjon: ekstraoppgaver

## A. Skills og plugins fra fellesskapet

Det finnes ikke én riktig kombinasjon av utvidelser. Et godt forsøk dokumenterer en baseline, tester én endring om gangen og kontrollerer den faktiske effekten i stedet for å anta at installasjonen virket.

Se etter disse vurderingene:

- En skill består hovedsakelig av instrukser som modellen kan velge å laste. Kontroller derfor både aktivering og om instruksene faktisk endrer resultatet.
- En plugin kjører kode i OpenCode-prosessen og kan registrere hooks eller tools. En MCP-server er en separat integrasjon som tilbyr verktøy og datakilder gjennom en standard protokoll. Les kildekoden og undersøk tilganger, nettverkskall og avhengigheter før installasjon.
- Popularitet, nedlastingstall og automatiske sikkerhetsskanninger er nyttige signaler, men erstatter ikke kildekontroll og en vurdering av vedlikeholderen.
- En utvidelse bør gi målbar nytte sammenlignet med baselinen. Flere funksjoner kan også gi mer støy, større angrepsflate eller høyere tokenbruk.
- Prosjektlokal installasjon, versjonslåsing og utprøving uten hemmeligheter begrenser konsekvensene dersom utvidelsen oppfører seg uventet.

Skillen passer når effekten kan oppnås med arbeidsinstrukser og modellens skjønn. En plugin passer når effekten krever hooks eller tett integrasjon med OpenCode-prosessen. En MCP-server passer når et avgrenset verktøy eller en ekstern datakilde skal kunne brukes på tvers av harness. Alle typene må vurderes på nytt når kildekoden eller den installerte versjonen endres.

Med CodeGraph bør deltakeren sammenligne samme strukturelle spørsmål med og uten indeksen. Færre søk og fil-lesinger kan gjøre svaret raskere og billigere, men ett stort verktøysvar kan også fylle mer av den gjenværende samtalekonteksten. Resultatet bør derfor vurderes ut fra både verktøykall, tokenbruk, svartid og presisjon.

## B. Review my changes

En mulig `.opencode/commands/review-my-changes.md`:

```markdown
---
description: Gjennomgå mine ucommittede endringer med korte, konkrete forbedringsforslag.
agent: plan
---

Gjennomgå alle nåværende ucommittede endringer i Git-arbeidsområdet, inkludert staged, unstaged og nye filer. Ekstra fokus fra brukeren: $ARGUMENTS

Ikke endre filer eller implementer forslag. Vurder korrekthet, tydelighet, vedlikeholdbarhet og manglende tester. Prioriter maksimalt fem konkrete forbedringer.

Svar kort i dette formatet:

1. **Kort oppsummering**: Hva endringen ser ut til å gjøre.
2. **Viktigste forbedringer**: Alvorlighetsgrad og filreferanse, hvorfor det betyr noe, og ett konkret forslag per funn.
3. **Gode grep**: Ett eller to valg som fungerer godt og bør videreføres.
4. **Neste steg**: De viktigste handlingene i prioritert rekkefølge.

Hvis du ikke finner konkrete forbedringspunkter, si det tydelig og nevn eventuelle testområder du ikke kunne verifisere.
```

`agent: plan` gjør commanden skrivebeskyttet gjennom plan-agentens permissions, ikke bare gjennom teksten «ikke endre filer». Agenten trenger Git-status og både vanlig og staged diff for å se endrede versjonerte filer. Nye filer vises i status, men ikke i en vanlig diff før de er lagt til, så de må leses separat.

Et godt svar er selektivt. Det gjentar ikke hele diffen eller fyller lista med smakspreferanser, men forklarer de viktigste forbedringene med en tydelig kobling mellom sted, konsekvens og neste handling. Positive observasjoner gjør reviewen mer lærerik så lenge de er konkrete og ikke fortrenger reelle funn.

## C. Kontekst og kostnad

Det finnes ikke ett forventet tall; modell, leverandør, cache og normal variasjon mellom kjøringer påvirker resultatet. Sammenlign differansen i `opencode stats` før og etter hver kjøring dersom TUI-en ikke viser nok informasjon. Kontroller også at `quiz-expert` faktisk ble aktivert bare i skill-varianten.

Se etter disse avveiningene:

- Fast kontekst passer for korte, stabile regler med høy konsekvens.
- Skills reduserer normal grunnkontekst, men krever at beskrivelsen gjør aktiveringen pålitelig.
- Subagenter isolerer spesialarbeid, men delegering sender ny input og produserer ny output.
- Kortere output og færre unødvendige verktøykall kan være vel så viktig som en billigere modell.
- En liten modell er ikke billig dersom den må prøve fem ganger; en dyr modell er ikke effektiv dersom oppgaven er mekanisk.

Den direkte varianten kan være presis uten ekstra verktøykall, men betaler for all innlimt kontekst med én gang. Skill-varianten holder startprompten liten, men agenten må velge skillen riktig og kan trenge verktøykall for å hente filer som skillen peker til. Én kjøring er derfor en indikasjon, ikke et bevis på hvilken variant som alltid er billigst.

Identiske og stabile prompt-prefiks kan ofte caches, men vilkårene varierer mellom leverandører og modeller. Cache fjerner heller ikke risikoen for at irrelevant kontekst fortrenger nyttig informasjon eller gjør instruksjonene vanskeligere å følge.

En sjelden regel bør bare flyttes fra `AGENTS.md` dersom den gjelder arbeidsområdet skillen dekker. En regel om validering av seedede spørsmål passer for eksempel i `quiz-expert`; en regel som gjelder alt arbeid i repoet bør bli værende i `AGENTS.md`. Dersom hovedoppgavene har etterlatt `AGENTS.md` uten en slik regel, er det riktig å nøye seg med et forslag i stedet for å finne på en permanent regel.

## D. Custom tool

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

Med migreringen slik den ligger i repoet, skal verktøyet svare at den oppretter **10 quizspørsmål**. Opptellingen avhenger av at hvert spørsmål står på en egen linje som begynner med `(`. En robust produksjonsløsning burde parse SQL, eller telle i en ny database der bare migreringene er kjørt. Å spørre en eksisterende utviklingsdatabase kan gi feil svar fordi brukeren kan ha lagt til flere spørsmål.

Her er poenget verktøygrensen: modellen får et smalere, navngitt alternativ til shell. For at dette også skal være en sikkerhetsgrense, må verktøyet gis til en agent som har `bash: deny` og bare de øvrige permissions den trenger.

## E. Hooks og kvalitetsport

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
import { isAbsolute, relative, resolve, sep } from "node:path"
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

        if (
          frontendPath === ".." ||
          frontendPath.startsWith(`..${sep}`) ||
          isAbsolute(frontendPath)
        ) continue
        if (!/\.(js|jsx|mjs|ts|tsx)$/.test(frontendPath)) continue

        console.log(`[quality-gate] sjekker ${frontendPath}`)
        const result = await $`volta run pnpm eslint -- ${frontendPath}`
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

Automatisk lint etter hver filendring gir rask feedback, men kan bli tregt og støyende. `.nothrow()` hindrer at en lintfeil gjør et allerede fullført edit-kall til en verktøyfeil. Et vanlig kompromiss er å samle endrede filer og bruke pluginens `event`-hook til å kjøre sjekken når et `session.status`-event melder at sesjonen er `idle`. Et enklere alternativ er å la hooken bare logge eller påminne, og kjøre full sjekk én gang før agenten avslutter.

Det finnes ikke ett riktig svar på om hooken bør formatere eller bare rapportere. Automatisk formatering kan holde arbeidsområdet ryddig, men kan også skjule hva agenten endret eller skape nye endringer mellom to steg. En hook passer best når reaksjonen må skje hver gang og kan gjøres forutsigbart; en `AGENTS.md`-instruks passer bedre når agenten må vurdere kontekst og hensikt.

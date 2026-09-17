# 🧩 2. Reparer quiz-eksperten

En skill er instruksjoner som agenten kan laste **ved behov**. Agenten ser `name` og `description` først; selve innholdet **bruker ikke kontekst før skillen aktiveres**. `description` er derfor både søkeord og «når skal jeg bruke dette?»-regel.

En prosjekt-skill for Claude Code ligger i `.claude/skills/<navn>/SKILL.md`. Claude Code følger den åpne Agent Skills-standarden og støtter i tillegg egne valg for blant annet aktivering og verktøy. `description` bør si både hva skillen gjør og når den skal brukes. Mappenavnet blir navnet på kommandoen `/navn`.

### 🧩 Oppgave 2A: Finn skillen

1. Kjør `/skills` og finn `quiz-expert`.
2. Bekreft at den blir oppdaget fra [`.claude/skills/quiz-expert/SKILL.md`](../.claude/skills/quiz-expert/SKILL.md).
3. Tøm kontekstvinduet med `/clear`, bytt til Plan mode og be agenten: `Planlegg hvordan du ville lagt til et seedet quizspørsmål om Narvik i det første databaseoppsettet. Ikke endre filer.` Legg merke til _om_ skillen aktiveres.
4. Dersom skillen ikke ble aktivert, frykt ikke! Oppgave 2B skal se nærmere på hvorfor dette kan skje.
5. Ta en titt på hvordan [quiz-expert](../.claude/skills/quiz-expert/SKILL.md) er bygd opp; legg merke til `name`, `description` og instruksjonen.

## Skills og kontekstkostnad

Anta at det finnes en skill hvor `name` og `description` sammen utgjør **10 tokens**, og selve instruksjonene i skillen utgjør **1 000 tokens**. Se også for deg at du i løpet av én arbeidsdag har 10 ulike Claude Code-sesjoner, hvorav bare én benytter skillen. For enkelhetens skyld sier vi at hver sesjon kaller modellen 20 ganger.

For scenarioene «instruksjonene ligger bare som en skill» og «instruksjonene ligger bare i `CLAUDE.md`» blir det forenklede regnestykket:

| Hvor ligger instruksjonene? | Regnestykke | Totalt |
| --- | --- | ---: |
| I en skill, aktiveres bare når den er relevant | `(1 000 tokens × 1 sesjon × 20 modellkall) + (10 tokens × 10 sesjoner × 20 modellkall)` | **22 000 tokens** |
| I `CLAUDE.md`, aktiv i alle kall | `1 000 tokens × 10 sesjoner × 20 modellkall` | **200 000 tokens** |

> [!TIP]
> 1 AI-token tilsvarer omtrent 4 bokstaver/tegn

Med disse forutsetningene bruker skill-varianten altså omtrent **178 000 færre tokens**, eller rundt **89 % mindre**, før cache. Sammenligningen er forenklet, men viser hvorfor det lønner seg å legge spesialiserte instruksjoner i en skill i stedet for i `CLAUDE.md`.

Dette er grunnen til at skills kan redusere normal kontekst og kostnad. Gevinsten forsvinner dersom `description` er så bred at skillen lastes i nesten alle oppgaver. Når skillen først er lastet, blir innholdet en del av samtalen og følger normalt med i senere modellkall i den sesjonen.

### 🧩 Oppgave 2B: Reparer beskrivelsen og innholdet

Kliff Arnes `quiz-expert`-skill er teknisk gyldig, men en `description` som sier «hjelper med spørsmål» forteller verken når den trengs eller hva ekspertisen består av. Claude Code finner skillen, men agenten har nesten ikke noe grunnlag for å velge den riktig.

Her betyr «initielle spørsmål» **seedede spørsmål** som legges inn når applikasjonen startes. Det er en annen arbeidsflyt enn å legge til et spørsmål gjennom UI-et eller API-et.

Reparer [`SKILL.md`](../.claude/skills/quiz-expert/SKILL.md) slik at skillen kan brukes når agenten skal **legge til seedede quizspørsmål**. Skillen skal gi agenten nok prosjektkontekst til å finne ut hvordan endringen skal gjennomføres på riktig måte. Forbedre skillen med:

- en konkret beskrivelse av **hva** skillen skal hjelpe med og **når** den skal brukes
- relevante filer og valideringsregler for seedede spørsmål
- relevante kommandoer for å verifisere at migreringa og appens oppstart fungerer

> [!TIP]
> Du kan få et forslag fra agenten på hvordan skillen bør forbedres. Bytt gjerne til Plan mode med `Shift+Tab` først.

[Se løsningsforslag for oppgave 2B](./losningsforslag/02-reparer-skill.md)

### 🧩 Oppgave 2C: Test aktiveringen på nytt

1. Lukk og åpne Claude på nytt, slik at den oppdaterte skillen lastes inn
2. Bruk `/clear`, behold Plan mode og be agenten planlegge det samme seedede spørsmålet uten å endre filer. Gjenta analysen fra oppgave 2A.
3. Sammenlign om og hvordan skillen ble brukt før og etter endringen.
4. Gå tilbake til normalmodus eller `accept edits on` før du fortsetter.

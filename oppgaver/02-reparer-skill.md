# 🧩 2. Reparer quiz-eksperten

En skill er instruksjoner som agenten kan laste **ved behov**. Agenten ser `name` og `description` først; selve innholdet **bruker ikke kontekst før skillen aktiveres**. `description` er derfor både søkeord og «når skal jeg bruke dette?»-regel.

En skill kan ligge i `.agents/skills/<navn>/SKILL.md`. Denne strukturen støttes av OpenCode og flere andre agent-harness. Den må skrives på YAML-format med både `name` og `description`, og mappenavnet som skillen ligger i må samsvare med `name`.

### 🧩 Oppgave 2A: Finn skillen

1. Be agenten liste tilgjengelige skills.
2. Bekreft at `quiz-expert` blir oppdaget fra [`.agents/skills/quiz-expert/SKILL.md`](../.agents/skills/quiz-expert/SKILL.md).
   3. Skillen er aktivert dersom du ser `→ Skill "quiz-expert"` i terminalen
3. Tøm kontekstvinduet med `/new`, og be agenten `Opprett et nytt quizspørsmål om Narvik`. Legg merke til om skillen aktiveres, og hvor stor konteksten blir til slutt som følge av denne ene oppgaven som agenten utførte med skillen.
4. Ta en titt på hvordan skillen [quiz-expert](../.agents/skills/quiz-expert/SKILL.md) er bygd opp; legg merke til formatet på både `name` og `description`, og den generelle instruksjonen som skillen består av.

## Skills og kontekstkostnad

Anta at det finnes en skill hvor `name` og `description` utgjør **10 tokens**, og selve instruksjonene i skillen utgjør **1 000 tokens**. Se også for deg at du iløpet av én vilkårlig arbeidsdag har totalt 10 ulike OpenCode-sesjoner, hvorav kun 1 av disse sesjonene benyttet skillen. For enkelhetens skyld sier vi også at hver sesjon kalte på modellen 20 ganger.

For de to scenarioene "Instruksjonene ligger kun som en egen skill" og "Instruksjonene ligger kun i AGENTS.md", så blir regnestykket slik:

| Hvor ligger instruksjonene? | Regnestykke | Totalt |
| --- | --- | ---: |
| I en skill, aktiveres bare når den er relevant | `(1 000 tokens × 1 sesjon × 20 modellkall) + (10 tokens × 10 sesjoner × 20 modellkall)` | **22 000 tokens** |
| I `AGENTS.md`, aktiv i alle kall | `1 000 tokens × 10 sesjoner × 20 modellkall` | **200 000 tokens** |

> [!TIP]
> 1 AI-token tilsvarer omtrent 4 bokstaver/tegn

Med disse forutsetningene bruker skill-varianten altså omtrent **178 000 færre tokens**, eller rundt **89 % mindre**, før cache. Sammenligningen er forenklet, men viser hvorfor det lønner seg å legge spesialiserte instruksjoner i en skill i stedet for i `AGENTS.md`.

Dette er grunnen til at skills kan redusere normal kontekst og kostnad. Gevinsten forsvinner dersom `description` er så bred at skillen lastes i nesten alle oppgaver. Når skillen først er lastet, blir innholdet en del av samtalen og følger normalt med i senere modellkall i den sesjonen.

### 🧩 Oppgave 2B: Reparer beskrivelsen og innholdet

Kliff Arnes `quiz-expert` skill er teknisk gyldig, men en `description` som sier «hjelper med spørsmål» forteller verken når den trengs eller hva
ekspertisen består av. OpenCode finner skillen, men agenten har nesten ikke noe grunnlag for å velge den.

Reparer [`SKILL.md`](../.agents/skills/quiz-expert/SKILL.md) slik at skillen kan brukes når agenten skal **opprette quizspørsmål**. Skillen skal gi agenten nok prosjektkontekst til å finne ut hvordan opprettelsen skal gjennomføres på riktig måte. Forbedre skillen med:

- en konkret beskrivelse av **hva** skillen skal hjelpe med og **når** den skal brukes
- relevante filer og valideringsregler for opprettelse av de initielle spørsmålene i appen
- relevante kommandoer for å verifisere at opprettelsen fungerer

> [!TIP]
> Du kan få et forslag fra agenten på hvordan denne skillen bør forbedres. Hvorfor ikke prøve ut OpenCode sin `Plan`-modus (ved å trykke på Tab-tasten inne i sesjonen) i samme slengen?

[Se løsningsforslag for oppgave 2B](./fasit/02-reparer-skill.md)

### 🧩 Oppgave 2C: Test aktiveringen på nytt

1. Start OpenCode på nytt.
2. Be agenten om å opprette et quizspørsmål, og gjenta analysen fra oppgave 2A for å se om skillen aktiveres.
3. Sammenlign om og hvordan skillen ble brukt før og etter endringen.
   4. Merket du noen endring i hvor mye kontekst agenten brukte?

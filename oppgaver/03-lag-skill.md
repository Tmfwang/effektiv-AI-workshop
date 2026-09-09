# 🧩 3. Lag en ny skill

Skills egner seg for repeterbare arbeidsmåter som bare er relevante av og til. Hvis instruksen gjelder alt arbeid, hører den heller hjemme i `CLAUDE.md`. Hvis arbeidet bør isoleres og få egne verktøy eller en egen modell, kan en subagent passe bedre.

Kliff Arne stoppet etter den første skillen. Nå skal du lage en ny skill og se hvor presist bruksområdet må beskrives før agenten velger riktig.

### 🧩 Oppgave 3A: Definer den nye skillens bruksområde

Lag en skill som hjelper agenten med å starte både backend og frontend for lokal utvikling.

Opprett `.claude/skills/run-app/SKILL.md` med gyldig YAML-frontmatter (se [quiz-expert](../.claude/skills/quiz-expert/SKILL.md) for inspirasjon). Skriv `name` og en norsk `description` som sier både **hva** skillen kan og **når** den skal brukes.

I denne delen definerer du bare skillens navn og bruksområde i YAML-filen. Oppgave 3A svarer på «Når skal agenten velge skillen?». Selve arbeidsinstruksjonene skriver du i 3B.

<details>
<summary>Hint</summary>

Inkluder i `description` konkrete ord brukeren sannsynligvis skriver, for eksempel «start appen», «kjør appen lokalt»
eller «åpne quizen». Inkluder også «Bruk BARE når ...» dersom skillen aktiveres for ofte.

</details>

## Presisjon påvirker kostnaden

En token er en liten del av teksten som sendes til modellen. Før agenten velger en skill, ser den en kort `description` for hver tilgjengelige skill, men normalt ikke hele instruksjonen. Hvis repoet har ti skills, og hvert `description`-felt er på 30 tokens, blir det omtrent **300 tokens** med valgkontekst. Når agenten velger for eksempel `run-app`, trenger den normalt bare å laste instruksjonene fra den éne skillen inn i konteksten.

`description` må samtidig være presis. Hvis for eksempel både `run-app` og `quiz-ekspert` har en `description` som gjør at begge *alltid* ser ut til å være relevant for det man jobber med, kan agenten ende opp med å *alltid* laste instruksjonene fra *begge* inn i konteksten, og da mister man all effektivitetsgevinst med å ha de som skills i utgangspunktet.

Et godt `name` og en presis `description` handler derfor ikke bare om organisering. Det påvirker hvor mye kontekst som lastes, hvor mange modellsteg agenten bruker, og om instruksjonene motsier hverandre.

### 🧩 Oppgave 3B: Skriv arbeidsinstruksene

Fyll inn instruksjonsinnholdet i skillen du opprettet under [`.claude/skills/`](../.claude/skills/). Dette innholdet leser agenten etter at skillen er valgt. Det skal forklare **hvordan** agenten starter og kontrollerer appen:

1. Bruke oppstartsinstruksjonene i `README.md`.
2. Fortelle hvordan avhengigheter installeres, backend og frontend startes, og hvordan appen verifiseres.
3. Ha alle beskrivelser og instrukser på norsk.
4. Være kortere enn 30 linjer.
5. Peke til filer fremfor å lime inn innholdet deres.
6. Fortelle agenten hva den **ikke** skal gjøre.

Oppgave 3B svarer på «Hva skal agenten gjøre etter at skillen er valgt?».

[Se løsningsforslag for oppgave 3A og 3B](./losningsforslag/03-lag-skill.md)

> [!TIP]
> Du kan få et forslag fra agenten på hva *instruksjonene* bør være. Prøv gjerne Plan mode med `Shift+Tab`.

### 🧩 Oppgave 3C: Prøv grensene

1. Start Claude Code på nytt slik at den nye skillen lastes inn. Kjør `/skills` og bekreft at `/run-app` er tilgjengelig.
2. Still ett spørsmål som bør aktivere skillen.
3. Verifiser at agenten fikk startet appen ved å besøke <http://localhost:3000>.
4. Bruk `/clear`, og still ett nærliggende spørsmål som ikke bør aktivere den.
5. Juster `description` dersom agenten velger feil. Start Claude Code på nytt før du tester endringen.

Claude Code har også de innebygde skillene `/run`, `/verify` og `/run-skill-generator`. Diskuter hvorfor en kort, versjonskontrollert prosjekt-skill fortsatt kan være nyttig for en app som krever både backend, frontend og rotmiljø.

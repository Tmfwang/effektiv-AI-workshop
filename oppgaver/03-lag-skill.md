# 🧩 3. Lag en ny skill

Skills egner seg for repeterbare arbeidsmåter som bare er relevante av og til. Hvis instruksen gjelder alt arbeid, hører den heller hjemme i `AGENTS.md`. Hvis arbeidet bør isoleres og få egne verktøy eller en egen modell, kan en subagent passe bedre.

Kliff Arne stoppet etter den første skillen. Nå skal du lage en ny og se hvor presist bruksområdet må beskrives før agenten velger riktig.

### 🧩 Oppgave 3A: Lag en skill for å kjøre appen

Lag en skill som hjelper agenten med å starte både backend og frontend for lokal utvikling.

Opprett `.agents/skills/run-app/SKILL.md` med på gyldig YAML-format (se på [`quiz-expert` skillen for inspirasjon](../.agents/skills/quiz-expert/SKILL.md)). Skriv en norsk `description` som sier både **hva** skillen kan og **når** den skal brukes.

Skillen skal bruke instruksjonene i `README.md` for å installere avhengigheter og kjøre opp appen på riktig måte. I tillegg skal den inneholde instruksjoner om hvordan verifisere at appen kjører.

## Presisjon påvirker kostnaden

Ti skills med beskrivelser på 30 tokens bruker omtrent **300 tokens** i listen agenten må velge fra. Det er vanligvis billigere enn å laste ti skill-filer på 800 tokens hver, som ville brukt **8 000 tokens**. Men beskrivelser har også en indirekte kostnad: Hvis `run-app` og `frontend-checks` begge ser relevante ut, kan agenten laste begge, bruke flere verktøykall og få 1 600 tokens med delvis overlappende instrukser.

Et godt navn og en presis beskrivelse handler derfor ikke bare om organisering. Det påvirker hvor mye kontekst som lastes, hvor mange modellsteg agenten bruker, og om instruksjonene motsier hverandre.

### 🧩 Oppgave 3B: Skriv resten av skillen

Fullfør skillen du opprettet under [`.agents/skills/`](../.agents/skills/). Den skal:

1. Ha alle beskrivelser og instrukser på norsk.
2. Være kortere enn 30 linjer.
3. Peke til filer fremfor å lime inn innholdet deres.
4. Fortelle agenten hva den **ikke** skal gjøre.

[Se løsningsforslag for oppgave 3A og 3B](./fasit/03-lag-skill.md)

<details>
<summary>Hint</summary>

Start beskrivelsen med konkrete ord brukeren sannsynligvis skriver, for eksempel «start appen», «kjør appen lokalt» eller «åpne quizen». Bruk «Bruk BARE når ...» dersom skillen aktiveres for ofte.

</details>

### 🧩 Oppgave 3C: Prøv grensene

1. Start OpenCode på nytt.
2. Still ett spørsmål som bør aktivere skillen.
3. Still ett nærliggende spørsmål som ikke bør aktivere den.
4. Juster beskrivelsen dersom agenten velger feil.

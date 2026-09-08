# 🧩 0. Bli kjent med OpenCode

Før du endrer agentoppsettet, bruk noen minutter på å bli kjent med OpenCode som verktøy.

## Autentiser deg

OpenCode trenger tilgang til en modelltilbyder. Organisasjonen din kan for eksempel ha valgt GitHub Copilot, OpenAI, Anthropic eller Google.

Hvis du ikke vet hvilken tilbyder eller konto du skal bruke, spør fasilitatoren. Du kan autentisere fra terminalen før oppstart.

### 🧩 Oppgave 0A: Kontroller innloggingen

1. Kjør `opencode auth list`.
2. Bekreft at GitHub Copilot eller tilbyderen fasilitatoren har oppgitt, står i listen.
3. Kjør `opencode auth login` dersom den mangler, og følg innloggingsflyten.

## Start OpenCode

Mappen du åpner OpenCode fra er viktig fordi den brukes til å finne prosjektets `AGENTS.md`, repo-spesifikk OpenCode-config, skills, agents og plugins.

### 🧩 Oppgave 0B: Start i riktig mappe

1. Åpne en terminal, gå til roten av dette repoet og start OpenCode:

```
cd /sti/til/effektiv-AI-workshop

opencode
```

2. Avslutt med `/exit` eller `ctrl+c`, start OpenCode på nytt og fortsett derfra.

## Modell og variant

En **modell** er selve språkmodellen, for eksempel en modell fra OpenAI, Anthropic eller Google.

### Relativ kostnad i GitHub Copilot

Hvilken modell du velger å bruke er kanskje den viktigste faktoren når det kommer til kostnad. For å gi et raskt bilde av den relative kostnaden av de ulike modellene, så kan man se i Github Copilot sin prisoversikt under. Luna er i dette tilfellet satt til `1×`.

| Modell | Kategori | 1M tokens som input | 1M tokens som output | Ca. relativ kostnad |
| --- | --- | ---: | ---: | ---: |
| GPT-5.6 Luna | Lightweight | $0.20 | $1.20 | **1×** |
| GPT-5 mini | Lightweight | $0.25 | $2.00 | 1,5× |
| Claude Haiku 4.5 | Versatile | $1.00 | $5.00 | 4,5× |
| Claude Sonnet 5 | Versatile | $2.00 | $10.00 | 9,1× |
| GPT-5.6 Terra | Versatile | $2.00 | $12.00 | 10× |
| Claude Sonnet 4 / 4.6 | Versatile | $3.00 | $15.00 | 13,6× |
| GPT-5.6 Sol | Powerful | $4.00 | $20.00 | 18,2× |
| Claude Opus 4.7 / 4.8 / 5 | Powerful | $5.00 | $25.00 | 22,7× |
| GPT-6 Astra | Powerful | $10.00 | $50.00 | 45,5× |


Til denne workshoppen er oppgavene små og vi behøver ikke de største og dyreste modellene. Derfor bruker vi **GPT-5.6 Luna** videre. Hvis Luna ikke er tilgjengelig, er **Claude Haiku 4.5** et rimelig Claude-alternativ.

En **variant** endrer innstillingene til samme modell, ofte hvor mye resonnering den bruker, altså hvor mye den tenker. Høyere resonneringsnivå kan gi bedre resultat på vanskelige oppgaver, men bruker ofte flere output-tokens og mer tid. Ikke alle modeller har varianter.

### 🧩 Oppgave 0C: Velg workshopmodell

1. Kjør `/models`, finn **GPT-5.6 Luna** (evt. **Claude Haiku**) under riktig tilbyder og velg den.
2. Velg `default` varianten 

> [!TIP]
> Du kan alltid endre variant med `/variants`, eller modell med `/models`, selv i en aktiv agentsesjon

## Agentmodus

OpenCode kommer med to agentmoduser innebygd. `Build` er laget for å utføre arbeid og kan normalt redigere filer. `Plan` er laget for analyse og planlegging, med strengere tilganger. Modellen kan være den samme, men agentene har forskjellige instrukser og begrensinger.

Bruk `Plan` når du vil undersøke før noe endres, og `Build` når du vil gjennomføre endringen. Dette kan være spesielt nyttig på større endringer, hvor du vil forsikre deg om at du og agenten er enig om implementeringsplanen før den setter igang.

### 🧩 Oppgave 0D: Bytt primæragent

1. Trykk `Tab` i en OpenCode-sesjon, og se hvordan det toggler den valgte agentmodusen.
2. Bruk `Plan` til spørsmålet: `Forklar kort hva dette repoet inneholder.`
3. Bytt tilbake til `Build` før du fortsetter.

## Kontekst og kostnad

Jo mer AI-agenten jobber, desto mer kode både leser og skriver den. Dette øker størrelsen på konteksten i sesjonen din, og dermed kostnaden. Vi skal ikke gå dypere inn på dette i denne oppgaven, men OpenCode viser live i sesjonen både størrelsen på kontekstvinduet og den nåværende kostnaden (dersom leverandøren din støtter dette). Dette kan være greit å følge med på når du bruker agenter i hverdagen.

> [!TIP]
> `/new` tømmer kontekstvinduet ditt og starter en ny sesjon. Bruk dette når konteksten blir for stor, eller du starter på en *ny* oppgave.

> [!TIP]
> `/compact` reduserer kontekstvinduet ditt ved at AI-agenten skriver en oppsummering til seg selv av hele sesjonen, som den da jobber videre utifra. Bruk dette dersom kontekstvinduet blir for stort *underveis* i en oppgave.

# 🧩 0. Bli kjent med Claude Code

Før du endrer agentoppsettet, bruk noen minutter på å bli kjent med Claude Code som verktøy.

## Autentiser deg

Claude Code kan brukes med et Claude-abonnement, en Claude Console-konto eller en støttet skytilbyder som organisasjonen har konfigurert. Spør fasilitatoren hvis du ikke vet hvilken konto du skal bruke.

### 🧩 Oppgave 0A: Kontroller innloggingen

1. Kjør `claude` i terminalen.
2. Kjør `/login` i agentsesjonen dersom du ikke er innlogget, og følg innloggingsflyten.
3. Ikke legg API-nøkler i repoet, `.claude/settings.json` eller `.mcp.json`.

## Start Claude Code

Mappen du starter Claude Code fra brukes til å finne prosjektets `CLAUDE.md`, `.claude/settings.json`, skills, subagenter og `.mcp.json`.

### 🧩 Oppgave 0B: Start i riktig mappe

1. Åpne en terminal, gå til roten av dette repoet og start Claude Code:

   ```bash
   cd /path/to/effektiv-AI-workshop
   claude
   ```

2. Godkjenn prosjektet dersom Claude Code viser en tillitsdialog.
3. Kjør `/status`, og kontroller at `Project settings` vises blant innstillingskildene. Arbeidsmappen i oppstartsteksten skal være reporoten.
4. Avslutt med `/exit` eller `Ctrl+D` to ganger, og start Claude Code på nytt.

## Modell og innsatsnivå

Claude Code viser modellene kontoen og organisasjonen din tillater. Modellutvalget og prisene kan endres, så workshoppen låser ikke et versjonsnummer i repoet.

En rask modell som Haiku passer ofte til enkel kartlegging. Sonnet er et godt standardvalg for kodearbeid, mens Opus kan være nyttig for de vanskeligste oppgavene. En billig modell kan likevel bli dyr hvis den trenger mange forsøk.

`effort` styrer hvor mye arbeid modellen legger i et svar. Høyere nivå kan gi bedre resultat på krevende oppgaver, men bruker vanligvis mer tid og flere tokens.

### 🧩 Oppgave 0C: Velg workshopmodell

1. Kjør `/model` og velg en tilgjengelig **Sonnet**-modell. Bruk ellers modellen fasilitatoren anbefaler.
2. Kjør `/effort` og velg et lavt eller middels nivå.
3. Legg merke til modellnavnet i statuslinjen. Du kan bruke `/model` og `/effort` igjen i en aktiv sesjon.

## Permission modes

Trykk `Shift+Tab` for å bytte permission mode:

- **Manual** spør før filendringer og andre handlinger som ikke er godkjent.
- **Accept edits** tillater filendringer automatisk.
- **Plan** undersøker og foreslår endringer uten å redigere kildekoden.
- **Auto** lar en sikkerhetsklassifisering vurdere handlingene automatisk, slik at Claude kan jobbe med færre tillatelsesspørsmål.

Hvilke moduser som vises, kan variere med konto og oppsett.

En prompt som sier «ikke endre filer» er en instruks. Plan mode og verktøybegrensninger er sterkere tekniske grenser.

### 🧩 Oppgave 0D: Bytt permission mode

1. Trykk `Shift+Tab` til statuslinjen viser Plan mode. Du kan også bruke `/plan`.
2. Spør: `Forklar kort hva dette repoet inneholder.`
3. Legg merke til at Claude kan lese og søke, men ikke redigere.
4. Trykk `Shift+Tab` og gå tilbake til normalmodus eller `accept edits on` før du fortsetter.

## Kontekst og bruk

Jo mer agenten jobber, desto mer samtale, kildekode og verktøyresultater kan havne i kontekstvinduet. Bruk `/context` for å se hva som opptar plass. Bruk `/usage` for tilgjengelig bruksinformasjon; `/cost` er et alias i nyere Claude Code. Hva som vises avhenger av kontotype, og abonnementstall er ikke det samme som en API-faktura.

> [!TIP]
> `/clear` starter en ny samtale med tom kontekst. Den forrige samtalen slettes ikke og kan åpnes igjen med `/resume`.

> [!TIP]
> `/compact` oppsummerer samtalen slik at du kan fortsette en pågående oppgave med mindre kontekst.

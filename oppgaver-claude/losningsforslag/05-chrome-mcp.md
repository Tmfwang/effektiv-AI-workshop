# Løsningsforslag: Chrome DevTools MCP

## Del A

Den ferdig konfigurerte prosjektfila [`.mcp.json`](../../.mcp.json) inneholder:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--isolated=true",
        "--no-usage-statistics",
        "--no-performance-crux"
      ]
    }
  }
}
```

Kontroller konfigurasjonen fra terminalen:

```bash
claude mcp list
claude mcp get chrome-devtools
```

Den delte `.claude/settings.json` aktiverer `chrome-devtools` for alle som bruker repoet. Deretter viser `/mcp` statusen i sesjonen. `--isolated=true` gir Chrome en midlertidig profil, som reduserer risikoen for å eksponere vanlige informasjonskapsler og innloggede sesjoner.

Chrome DevTools MCP samler bruksstatistikk som standard. Ytelsesverktøy kan også sende trace-URL-er til Google CrUX. Workshopoppsettet reserverer seg mot begge deler med `--no-usage-statistics` og `--no-performance-crux`. Dette er uavhengig av Chrome-nettleserens egne innstillinger.

Hvis tilkoblingen feiler, kontroller at `npx` og en støttet Chrome-versjon kan startes fra samme terminal. Bruk `claude doctor` for konfigurasjonsfeil.

## Del B

En mulig testmelding er:

```text
Bruk Chrome DevTools MCP til å åpne http://localhost:3000. Ta et snapshot og fortell kort hva som vises. Start en ny quiz, svar på første spørsmål, bekreft at appen går videre til spørsmål 2, ta et skjermbilde av den nye tilstanden, og rapporter konsollfeil og mislykkede nettverkskall. Ikke endre kildekode.
```

Et godt resultat viser at Claude:

- bruker Chrome DevTools-verktøy i stedet for bare å hente HTML
- baserer beskrivelsen på den gjengitte siden
- samhandler med synlige elementer og observerer tilstandsendringen
- undersøker både konsoll og nettverk
- lar arbeidsområdet være uendret

Verktøynavnene kan variere mellom serverversjoner. Poenget er å observere flere smale nettleserverktøy i riktig rekkefølge.

## Tillit og avgrensning

Chrome DevTools MCP kjører lokalt, men sideinnhold, skjermbilder, konsollmeldinger og nettverksdata kan bli del av modellkonteksten. Den isolerte profilen og telemetriflaggene reduserer risiko, men gjør ikke sensitivt innhold på sidene ufarlig.

Teksthenting passer når du bare trenger innholdet fra en side. Chrome DevTools passer når resultatet avhenger av JavaScript, interaksjon, nettverk eller gjengivelse. Automatiserte tester er fortsatt best for repeterbar regresjonskontroll.

Serveren deaktiveres uten å slette oppsettet gjennom servermenyen i `/mcp`. Valget lagres per bruker og prosjekt i `~/.claude.json`, ikke i den delte `.mcp.json`. `claude mcp list` viser serveren som deaktivert til den aktiveres igjen.

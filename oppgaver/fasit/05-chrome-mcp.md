# Løsningsforslag: Chrome DevTools MCP

## Del A

I [`opencode.jsonc`](../../opencode.jsonc) ligger `mcp`-blokka ferdig utkommentert. Fjern `//` fra linjene i blokka, og behold de andre feltene:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  // Behold eksisterende konfigurasjon her.
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "chrome-devtools-mcp@latest",
        "--isolated=true"
      ],
      "enabled": true
    }
  }
}
```

Avslutt og start OpenCode på nytt etter endringen. Deretter skal denne kommandoen vise `chrome-devtools` som tilkoblet:

```bash
opencode mcp list
```

`--isolated=true` gir Chrome en midlertidig profil som slettes når nettleseren lukkes. Dersom tilkoblingen feiler, kontroller først at `npx` og en støttet Chrome-versjon kan startes fra samme terminal som OpenCode.

## Del B

En mulig testmelding er:

```text
Bruk Chrome DevTools MCP til å åpne http://localhost:3000. Ta et snapshot og fortell kort hva som vises. Utfør én ufarlig handling i quizen, ta et skjermbilde, og rapporter konsollfeil og mislykkede nettverkskall. Ikke endre kildekode.
```

Et godt resultat viser at agenten:

- navigerer med Chrome DevTools-verktøy i stedet for bare å hente HTML
- baserer beskrivelsen på et snapshot av den gjengitte siden
- kan samhandle med et synlig element og dokumentere resultatet
- undersøker både konsoll og nettverk uten å påstå at fravær av funn er en feil
- lar arbeidsområdet være uendret

Verktøynavnene kan variere mellom serverversjoner. Poenget er å observere at agenten velger flere smale nettleserverktøy i riktig rekkefølge.

## Tillit og avgrensning

Chrome DevTools MCP kjører lokalt, men sideinnhold, skjermbilder, konsollmeldinger og nettverksdata kan bli del av modellkonteksten. En isolert profil reduserer risikoen for å eksponere informasjonskapsler, innloggede sesjoner og nettleserhistorikk fra den vanlige profilen.

Å hente innhold direkte fra en nettadresse passer når du bare trenger teksten på siden. Chrome DevTools passer når resultatet avhenger av JavaScript, interaksjon, nettverk eller den faktiske gjengivelsen. Automatiserte tester er fortsatt bedre for repeterbar regresjonskontroll; MCP-verktøyet er særlig nyttig for utforskning og feilsøking.

Serveren kan deaktiveres uten å slette oppsettet:

```jsonc
"enabled": false
```

Etter omstart skal `opencode mcp list` vise serveren som deaktivert, og verktøyene skal ikke være tilgjengelige for agenten.

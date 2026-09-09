# 🧩 5. Gi agenten en nettleser

MCP standardiserer hvordan en agent finner og kaller verktøy fra eksterne servere. En nettleserserver kan navigere, klikke, lese den gjengitte siden og undersøke konsoll- og nettverkstrafikk.

I denne oppgaven kobler du Claude Code til den offisielle [Chrome DevTools MCP-serveren](https://github.com/ChromeDevTools/chrome-devtools-mcp). Serveren kjører lokalt, får kontroll over en isolert Chrome-profil og kan sende nettleserinnhold videre til modellen.

## Fire deler av harnesset

| Del | Hva den gjør | Når den brukes |
| --- | --- | --- |
| `CLAUDE.md` | Gir faste prosjektinstrukser som følger agenten. | Når regelen gjelder nesten alle oppgaver i repoet. |
| Skill | Gir ekstra arbeidsmåte eller fagkunnskap ved behov. | Når bare enkelte oppgaver trenger instruksen. |
| Subagent | Starter en separat agent med egen kontekst, prompt, modell og verktøy. | Når et avgrenset arbeid bør delegeres eller isoleres. |
| MCP-server | Kobler agenten til eksterne verktøy eller datakilder. | Når agenten trenger en ny kapabilitet, som å styre en nettleser. |

En skill forklarer hvordan agenten bør arbeide. En MCP-server gjør et faktisk verktøy tilgjengelig. En subagent har egen samtalekontekst; en MCP-server har ikke det.

### 🧩 Oppgave 5A: Inspiser og kontroller Chrome DevTools

1. Åpne prosjektfila [`.mcp.json`](../.mcp.json), og finn serveren `chrome-devtools` under `mcpServers`.
2. Kjør `claude mcp list` fra terminalen. `chrome-devtools` aktiveres av den delte `.claude/settings.json`. Ved første oppstart kan prosjektet likevel stå som `Pending approval` til du har godkjent prosjektets tillitsdialog.
3. Start Claude Code fra reporoten hvis du ikke allerede har en sesjon. Godkjenn prosjektet dersom Claude Code viser en tillitsdialog, og kjør `/mcp` for å kontrollere status.

[Se løsningsforslag for oppgave 5A](./losningsforslag/05-chrome-mcp.md#del-a)

## Fra konfigurasjon til verktøykall

`.mcp.json` er prosjektomfanget i Claude Code og kan versjonskontrolleres. Den delte `.claude/settings.json` aktiverer `chrome-devtools` automatisk for alle som bruker repoet. Claude Code kan likevel kreve at hver deltaker godkjenner prosjektets tillitsdialog første gang. En deltaker kan fortsatt deaktivere serveren lokalt gjennom `/mcp` uten å endre den delte konfigurasjonen.

Når serveren er tilkoblet, blir verktøyene søkbare for Claude. Chrome åpnes først når et nettleserverktøy brukes. Flere verktøy kan gi mer verktøykontekst og større angrepsflate, så behold bare servere prosjektet trenger.

### 🧩 Oppgave 5B: Undersøk quiz-appen med nettleseren

1. Start quiz-appen ved å be Claude bruke `run-app` fra [oppgave 3](./03-lag-skill.md) for å kjøre opp appen, eller følg [`README.md`](../README.md).
2. Be Claude åpne `http://localhost:3000` med Chrome DevTools MCP, ta et snapshot og beskrive det som faktisk vises.
3. Be Claude starte quizen, svare på det første spørsmålet og ta et skjermbilde av resultatet.
4. Be Claude kontrollere konsollmeldinger og mislykkede nettverkskall.
5. Sammenlign rapporten med det du ser i Chrome-vinduet.

Vær eksplisitt om at Chrome DevTools MCP skal brukes, og at kildekoden ikke skal endres. Hvis nettleseren ikke åpnes, be Claude liste tilgjengelige sider først.

[Se testforslag for oppgave 5B](./losningsforslag/05-chrome-mcp.md#del-b)

### 🧩 Oppgave 5C: Avgrens tilliten

Diskuter med sidemannen:

1. Hvilke data kan MCP-serveren og modellen se under testen?
2. Når er nettleserverktøyet bedre enn teksthenting eller en vanlig automatisert test?
3. Bør serveren være aktiv i alle sesjoner, eller bare ved behov?
4. Hvilke andre MCP-servere har du hørt om, og hvilke data eller handlinger gir de tilgang til?

Åpne `/mcp`, velg `chrome-devtools` og deaktiver serveren for dette prosjektet. Claude Code lagrer dette personlige valget lokalt uten å endre den delte `.mcp.json`. Bekreft med `claude mcp list`, og aktiver den igjen fra `/mcp` hvis du vil fortsette å bruke den.

[Se refleksjonsforslag for oppgave 5C](./losningsforslag/05-chrome-mcp.md#tillit-og-avgrensning)

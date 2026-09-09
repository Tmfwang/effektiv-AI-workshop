# 🧩 5. Gi agenten en nettleser

MCP standardiserer hvordan en agent finner og kaller verktøy fra eksterne servere. En nettleserserver gir agenten mer enn tekst fra en URL: Den kan navigere, klikke, lese den gjengitte siden og undersøke konsoll- og nettverkstrafikk.

I denne oppgaven skal du koble OpenCode til den offisielle [Chrome DevTools MCP-serveren](https://github.com/ChromeDevTools/chrome-devtools-mcp). Serveren kjører lokalt, men får kontroll over en Chrome-profil og kan sende innhold fra nettleseren videre til modellen.

## Fire deler av harnesset

Disse delene løser ulike problemer:

| Del | Hva den gjør | Når den brukes |
| --- | --- | --- |
| `AGENTS.md` | Gir faste prosjektinstrukser som følger agenten i arbeidet. | Når regelen gjelder nesten alle oppgaver i repoet. |
| Skill | Gir ekstra arbeidsmåte eller fagkunnskap som agenten kan laste ved behov. | Når kun enkelte oppgaver trenger instruksen. |
| Subagent | Starter en egen agent med egen samtale, prompt, modell og permissions. | Når et avgrenset arbeid bør delegeres eller isoleres. |
| MCP-server | Kobler agenten til eksterne verktøy eller datakilder. | Når agenten trenger en kapabilitet, som å styre en nettleser. |

Kort sagt: `AGENTS.md` gir faste regler, skills gir valgfri veiledning, subagenter gir en separat arbeider, og MCP-servere gir nye verktøy. En MCP-server er derfor ikke en skill: Skillen forklarer hvordan agenten bør jobbe, mens MCP-serveren gjør selve verktøyet tilgjengelig. En MCP-server er heller ikke en subagent; den har ingen egen samtale eller vurdering av oppgaven.

### 🧩 Oppgave 5A: Koble til Chrome DevTools

1. Kontroller at Chrome er installert på maskinen.
2. [Åpne `opencode.jsonc`](../opencode.jsonc), og finn den utkommenterte `mcp`-blokka ved siden av `enabled_providers`.
3. Fjern `//` fra linjene i blokka for å aktivere den. Du trenger ikke endre kommandoen eller kunne alle detaljene i den.
4. Avslutt OpenCode helt og start det på nytt fra reporoten.
5. Kjør `/mcps` i OpenCode-sesjonen og kontroller at serveren er tilkoblet.

[Se løsningsforslag for oppgave 5A](./losningsforslag/05-chrome-mcp.md#del-a)

## Fra konfigurasjon til verktøykall

Når OpenCode starter, kobler det til aktiverte MCP-servere og gjør verktøyene deres tilgjengelige for agenten. Chrome åpnes først når agenten bruker et verktøy som trenger nettleseren. Flere verktøy betyr samtidig mer verktøykontekst og flere handlinger agenten kan utføre, så MCP-servere bør bare aktiveres når de trengs.

### 🧩 Oppgave 5B: Undersøk quiz-appen med nettleseren

1. Start quiz-appen lokalt ved å be agenten bruke skillen `run-app` fra [oppgave 3](./03-lag-skill.md), eller følg [`README.md`](../README.md).
2. Be agenten åpne `http://localhost:3000` med Chrome MCP, ta et snapshot og kort beskrive det som faktisk vises.
3. Be agenten starte quizzen, svare på det første spørsmålet, bekrefte at appen går videre til spørsmål 2, og ta et skjermbilde av den nye tilstanden.
4. Be agenten kontrollere konsollmeldinger og mislykkede nettverkskall.
5. Sammenlign agentens rapport med det du ser i det åpne Chrome-vinduet.

Vær eksplisitt om at agenten skal bruke Chrome MCP, og ikke endre kildekode. Hvis nettleseren ikke åpnes, be agenten liste tilgjengelige sider først.

[Se testforslag for oppgave 5B](./losningsforslag/05-chrome-mcp.md#del-b)

### 🧩 Oppgave 5C: Avgrens tilliten

Diskuter med sidemannen:

1. Hvilke data kan MCP-serveren og modellen se under denne testen?
2. Når er nettleserverktøyet bedre enn å hente tekst direkte fra en nettside, eller bedre enn en vanlig automatisert test?
3. Bør serveren være aktiv i alle sesjoner, eller bare ved behov?
4. Hvilke andre MCPer har du hørt om, og hva brukes de til?
   1. Test de gjerne ut i dette repoet, ved å oppdatere [`opencode.jsonc`](../opencode.jsonc)

Sett `enabled` til `false` i [`opencode.jsonc`](../opencode.jsonc) når du er ferdig, start OpenCode på nytt og bekreft med `/mcps` at serveren er deaktivert.

[Se refleksjonsforslag for oppgave 5C](./losningsforslag/05-chrome-mcp.md#tillit-og-avgrensning)

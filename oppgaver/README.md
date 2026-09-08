# Agentisk AI: Rydd opp etter Kliff Arne

Kliff Arne har gjort noen raske valg i agentoppsettet til StackCheck. Hvert valg virker lite, men til sammen har de gitt agenten feil stemme, for lite prosjektkunnskap og for vide fullmakter. I denne workshoppen skal du finne ut hvorfor agenten oppfører seg slik, og rydde opp i konfigurasjonen.

Målet er ikke å skrive den perfekte prompten. Målet er å se hvordan små valg i et AI-harness påvirker **hva agenten vet, når den bruker spesialkunnskap, hvilke handlinger den kan gjøre, og hvor mye kontekst og penger den bruker**.

## Før du begynner

1. Åpne OpenCode fra roten av repoet.
2. Bruk en ny sesjon når en oppgave ber om det. Instruksjoner og plugins lastes ved oppstart, så start OpenCode på nytt etter at du endrer konfigurasjonsfiler.
3. Jobb direkte i filene oppgaven lenker til.
4. Test oppførselen ved å snakke med agenten, ikke bare ved å lese filene.
5. Står du fast, åpne hintet. Alle oppgaver har også et løsningsforslag; ikke nøl ved å sjekke disse underveis.

> Ikke legg hemmeligheter eller API-nøkler i repoet. Prosjektets `.env` er applikasjonskonfigurasjon og skal ikke brukes i oppgavene.

## Filplassering og portabilitet

Vi bruker felles konvensjoner når de finnes:

- `AGENTS.md` ligger i reporoten og inneholder korte prosjektinstrukser.
- Skills ligger under `.agents/skills/<navn>/SKILL.md`, som støttes av OpenCode og flere andre agent-harness.
- Subagenter, commands og plugins ligger under `.opencode/` fordi formatene og funksjonene i disse oppgavene er OpenCode-spesifikke.
- Alle instrukser, beskrivelser og prompts som agenten leser i dette repoet, skrives på norsk. Tekniske feltnavn og stabile identifikatorer beholdes på engelsk der formatet krever det.

En felles mappe betyr ikke at alle harness tolker innhold, permissions eller aktivering helt likt. Test alltid oppsettet i verktøyene teamet faktisk bruker.

## Hovedløype (ca. 55-60 minutter)

| Tid | Oppgave | Konsept |
| --- | --- | --- |
| 10 min | 🧩 [0. Bli kjent med OpenCode](./00-bli-kjent.md) | Oppstart, innlogging, modell, sesjon, kontekst og kostnad |
| 5 min | 🧩 [1. Fjern den interne spøken](./01-agents-md.md) | `AGENTS.md`, instruksjonshierarki |
| 10 min | 🧩 [2. Reparer quiz-eksperten](./02-reparer-skill.md) | Skills, kontekst ved behov |
| 10 min | 🧩 [3. Lag en ny skill](./03-lag-skill.md) | Avgrensning og aktivering |
| 10 min | 🧩 [4. Avgrens quiz-sheriffen](./04-subagent.md) | Subagent, orkestrering, permissions |
| 15 min | 🧩 [5. Gi agenten en nettleser](./05-chrome-mcp.md) | MCP, nettleserverktøy, tillit |

Har dere bare 30 minutter, gjør oppgave 0, 1, 2 og første del av 5, og la fasilitatoren demonstrere subagenten og nettleserkallet. Jobb gjerne to og to: én styrer OpenCode, én observerer når agentens oppførsel endrer seg.

## Ekstra

Ferdig tidlig? Fortsett med [avanserte oppgaver](./ekstra/README.md).

## Nyttige lenker

- [OpenCode: Rules](https://opencode.ai/docs/rules/)
- [OpenCode: Agent Skills](https://opencode.ai/docs/skills/)
- [OpenCode: Agents](https://opencode.ai/docs/agents/)
- [OpenCode: Plugins](https://opencode.ai/docs/plugins/)
- [OpenCode: Commands](https://opencode.ai/docs/commands/)
- [OpenCode: MCP servers](https://opencode.ai/docs/mcp-servers/)

For den som holder workshoppen: [fasilitatornotater](./FASILITATOR.md).

# Fasilitatornotater

## Målgruppe og læringsmål

Deltakerne er nyansatte utviklere med lite arbeidserfaring. Hold diskusjonen på konsekvenser og mentale modeller, ikke YAML-syntaks.

Etter workshoppen bør de kunne:

- skille faste instrukser, skills, subagenter, commands, hooks og MCP-servere
- plassere kontekst der den brukes, i stedet for å laste alt alltid
- bruke permissions som sikkerhetsgrense fremfor å stole på prompten
- forklare hovedagenten som orkestrator og vurdere kostnaden ved delegering
- velge deterministisk scripting for mekaniske oppgaver
- behandle plugins og MCP-servere som kode med reelle tillatelser

## Forslag til kjøreplan

| Tid | Aktivitet |
| --- | --- |
| 0-10 min | 🧩 Oppgave 0. Hjelp med innlogging, og la alle finne modell, variant, status og sesjoner. |
| 10-15 min | 🧩 Oppgave 1. Ikke forklar Narvik-dialekten før de ser effekten. |
| 15-30 min | 🧩 Oppgave 2 og eventuelt 3. Jobb to og to og sammenlign skill-aktivering. |
| 30-40 min | 🧩 Oppgave 4. Vis child session fra subagenten. |
| 40-55 min | 🧩 Oppgave 5. Koble til Chrome DevTools og undersøk quiz-appen. |
| 55-60 min | Diskuter datatilgang og når MCP-serveren bør være aktiv. |

For en 30-minuttersvariant: gjør 0, 1, 2 og 5A. Demonstrer oppgave 4 og ett nettleserkall fra 5B i plenum. Oppgave 3 blir ekstraarbeid.

## Den røde tråden

Kliff Arne er en gjennomgående forklaring på hvordan et harness gradvis kan bli dårlig:

- Han starter med en personlig preferanse i global kontekst.
- Han lager en skill som er for vag til å velges riktig.
- Han lager en subagent uten avgrensning eller minste privilegium.
- Han kobler til en nettleser uten å tenke på datatilgang, verktøykontekst eller hvor lenge integrasjonen bør være aktiv.

Humoren skal være tørr og ligge i konsekvensene av oppsettet, særlig at en intern spøk har blitt global konfigurasjon. Unngå flere utviklerreferanser eller vitser rundt hvert konsept. Be gruppa kritisere konfigurasjonen, ikke personen som skriver prompten.

## Begrepskart til presentasjonen

| Begrep | Hvor det møter deltakerne |
| --- | --- |
| AI-credits / kostnad | Modellkall, tokenmengde, delegering og ekstraoppgave A |
| `AGENTS.md` | Oppgave 1, alltid tilgjengelig kontekst |
| Skills | Oppgave 2-3, kontekst lastet ved behov |
| Hovedagent / orkestrator | Oppgave 4, holder brukertråden og delegerer |
| Subagent | Oppgave 4, isolert kontekst og permissions |
| Context / cache / input / output | Oppgave 0-4 og ekstraoppgave A |
| Scripting / tools | Ekstraoppgave C-D |
| Harness | Summen av agent, regler, verktøy, plugins og livssyklus rundt modellen |
| Command | Ekstraoppgave B, eksplisitt promptmal |
| Plugins / hooks | Ekstraoppgave D, deterministisk reaksjon på verktøykall |
| MCP | Oppgave 5, standardisert ekstern verktøygrense |

## Spørsmål til felles diskusjon

1. Hvilken endring påvirket agentens oppførsel mest?
2. Hvilke regler bør være tekstlige instrukser, og hvilke bør håndheves i kode?
3. Når er delegering verdt et ekstra modellkall?
4. Hva kan gå galt hvis en agent får kontroll over den vanlige nettleserprofilen din?
5. Hvilke data og rettigheter gir vi en plugin eller MCP-server?

## Praktiske fallgruver

- OpenCode må startes på nytt etter konfig-, agent-, skill-, plugin- og MCP-endringer.
- Global OpenCode-konfig kan påvirke resultatet. Be deltakerne sammenligne, ikke forvente identiske svar.
- Skill-aktivering er en modellbeslutning og kan variere. Det er en del av øvelsen.
- Chrome åpnes normalt først når agenten gjør det første nettleserkallet, ikke når MCP-serveren kobles til.
- Første oppstart kan bruke tid fordi `npx` laster ned MCP-pakken. Nettverk, `npx` og en støttet Chrome-versjon må være tilgjengelig.
- Bruk `opencode mcp list` for å skille tilkoblingsfeil fra feil i agentens valg av verktøy.
- Quiz-applikasjonen må kjøre under del 5B. Bruk en enkel lokal side eller `https://example.com` som reserve dersom appen ikke starter.
- Hooks-oppgaven under ekstraoppgavene krever installerte frontendavhengigheter og Volta for del B.

## Før workshoppen

1. Kjør `opencode --version`, og bruk en oppdatert versjon som støtter prosjektlokale skills, agents og plugins.
2. Bekreft at GitHub Copilot-tilgangen til deltakerne inkluderer GPT-5.6 Luna. Luna skal brukes gjennom workshoppen for å holde kostnaden lav og sammenlignbar. Hvis noen mangler Luna, bruk Claude Haiku 4.5 som felles alternativ.
3. La deltakere som ikke har brukt OpenCode før følge autentisering og oppstart i oppgave 0. Ha hjelp tilgjengelig for SSO, Copilot-tilgang eller API-nøkler.
4. Installer frontendavhengighetene og kontroller at quiz-applikasjonen kan startes etter `README.md`.
5. Bekreft at Chrome og `npx` er tilgjengelig, og test MCP-pakken på workshop-nettverket på forhånd.
6. Start OpenCode fra reporoten og bekreft at `quiz-expert` og `quiz-sheriff` vises.
7. Bekreft at plugin-skjelettet lastes uten feil dersom hooks-ekstraoppgaven skal brukes.
8. Ha fasitfilene åpne i en egen fane.
9. Ta en ren kopi eller gren per deltaker dersom alle skal kunne resette selv.

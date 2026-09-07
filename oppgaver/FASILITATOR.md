# Fasilitatornotater

## Målgruppe og læringsmål

Deltakerne er nyansatte utviklere med lite arbeidserfaring. Hold diskusjonen på konsekvenser og mentale modeller, ikke YAML-syntaks.

Etter workshoppen bør de kunne:

- skille faste instrukser, skills, subagenter, commands og hooks
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
| 40-55 min | 🧩 Oppgave 5. Stopp etter logging dersom tiden er knapp. |
| 55-60 min | Diskusjon eller demo av lint-hook. |

For en 30-minuttersvariant: gjør 0, 1, 2 og 5A. Demonstrer oppgave 4 og løsningen på 5B i plenum. Oppgave 3 blir ekstraarbeid.

## Den røde tråden

Kliff Arne er en gjennomgående forklaring på hvordan et harness gradvis kan bli dårlig:

- Han starter med en personlig preferanse i global kontekst.
- Han lager en skill som er for vag til å velges riktig.
- Han lager en subagent uten avgrensning eller minste privilegium.
- Han påbegynner en hook uten å tenke på frekvens, feil og responstid.

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
| Scripting / tools | Oppgave 5 og ekstraoppgave C |
| Harness | Summen av agent, regler, verktøy, plugins og livssyklus rundt modellen |
| Command | Ekstraoppgave B, eksplisitt promptmal |
| Plugins / hooks | Oppgave 5, deterministisk reaksjon på verktøykall |
| MCP | Ekstraoppgave D, standardisert ekstern verktøygrense |

## Spørsmål til felles diskusjon

1. Hvilken endring påvirket agentens oppførsel mest?
2. Hvilke regler bør være tekstlige instrukser, og hvilke bør håndheves i kode?
3. Når er delegering verdt et ekstra modellkall?
4. Hva kan gå galt hvis en hook automatisk endrer kode etter hvert edit-kall?
5. Hvilke data og rettigheter gir vi en plugin eller MCP-server?

## Praktiske fallgruver

- OpenCode må startes på nytt etter konfig-, agent-, skill- og pluginendringer.
- Global OpenCode-konfig kan påvirke resultatet. Be deltakerne sammenligne, ikke forvente identiske svar.
- Skill-aktivering er en modellbeslutning og kan variere. Det er en del av øvelsen.
- Hook-output kan vises i terminalen som startet OpenCode, ikke nødvendigvis i chatten.
- `apply_patch` har ikke nødvendigvis én filsti i argumentene. Løsningsforslaget leser filstier fra patchteksten, men verktøyformat kan variere mellom versjoner.
- Lint-hooken krever installerte frontendavhengigheter og Volta. Del A fungerer uten disse.
- Ikke bruk tid på å starte hele quiz-applikasjonen; oppgavene handler om harnesset.

## Før workshoppen

1. Kjør `opencode --version`, og bruk en oppdatert versjon som støtter prosjektlokale skills, agents og plugins.
2. Bekreft at GitHub Copilot-tilgangen til deltakerne inkluderer GPT-5.6 Luna. Luna skal brukes gjennom workshoppen for å holde kostnaden lav og sammenlignbar. Hvis noen mangler Luna, bruk Claude Haiku 4.5 som felles alternativ.
3. La deltakere som ikke har brukt OpenCode før følge autentisering og oppstart i oppgave 0. Ha hjelp tilgjengelig for SSO, Copilot-tilgang eller API-nøkler.
4. Kjør `volta run pnpm install --frozen-lockfile` i `frontend/` dersom del B av hooken skal demonstreres.
5. Start OpenCode fra reporoten og bekreft at `quiz-expert` og `quiz-sheriff` vises.
6. Bekreft at plugin-skjelettet lastes uten feil.
7. Ha fasitfilene åpne i en egen fane.
8. Ta en ren kopi eller gren per deltaker dersom alle skal kunne resette selv.

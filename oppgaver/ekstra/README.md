# 🧩 Ekstraoppgaver

Disse oppgavene er mer åpne. Velg det som virker interessant; de bygger ikke på hverandre. Oppgave B forutsetter likevel at du har laget `contract-reviewer` i oppgave 4.

## 🧩 A. Mål kontekst før du fyller den

`AGENTS.md` ligger i grunnkonteksten, mens skills lastes ved behov og subagenter får egne samtaler. Mer kontekst er ikke gratis: den kan øke inputkostnad, fortrenge relevant informasjon og gjøre instruksjoner vanskeligere å følge. Samtidig kan for lite kontekst gi flere verktøykall og dyrere feil.

1. Lag to nye sesjoner med samme modell. Ikke be agentene endre filer.
2. Be begge planlegge den samme lille endringen: å legge til ett seedet quizspørsmål.
3. I den ene sesjonen gir du all relevant prosjektinformasjon direkte i meldingen og ber agenten om ikke å laste en skill. I den andre gir du bare den korte oppgaven og lar den forbedrede `quiz-expert`-skillen finne og laste det som trengs. Kontroller at skillen faktisk aktiveres.
4. Sammenlign antall verktøykall, synlig token-/kostnadsstatistikk, presisjon og mengden unødvendig output. Du kan bruke `opencode stats` før og etter hver kjøring dersom TUI-en ikke viser nok informasjon. Noter at én kjøring bare gir en indikasjon; modellvariasjon og cache kan påvirke resultatet.
5. Se etter en sjelden, spesialisert regel i `AGENTS.md` som passer bedre i en skill. Flytt den og forklar hvorfor. Hvis det ikke finnes en slik regel etter hovedoppgavene, foreslå et realistisk eksempel og forklar plasseringen uten å endre filene.

Diskuter også cache: Identisk, stabil prompt-prefiks kan ofte caches av leverandøren, men cache gjør ikke irrelevant kontekst gratis eller ufarlig. Eksakt pris og cachepolitikk avhenger av valgt modell og leverandør.

[Se refleksjonsforslag](../fasit/ekstra.md#a-kontekst-og-kostnad)

## 🧩 B. Lag en repeterbar command

En command er en navngitt promptmal brukeren starter eksplisitt, for eksempel `/contract-check`. Den er nyttig for en kjent inngang til en arbeidsflyt. En skill velges av agenten ved behov; en hook kjører på en hendelse; en command velges av mennesket.

Kontroller først at `.opencode/agents/contract-reviewer.md` finnes fra oppgave 4. Opprett deretter `.opencode/commands/contract-check.md` som:

- tar imot `$ARGUMENTS`
- bruker `contract-reviewer`
- ber om en skrivebeskyttet gjennomgang
- krever funn sortert etter alvorlighetsgrad med filreferanser, etterfulgt av manglende tester
- krever at agenten sier tydelig fra dersom den ikke finner avvik

Start OpenCode på nytt og kjør `/contract-check quiz endpoint`.

[Se løsningsforslag](../fasit/ekstra.md#b-command)

## 🧩 C. Gi harnesset et custom tool

En plugin kan registrere et verktøy med kode og et argumentskjema. Modellen velger **om og når** verktøyet brukes, mens implementasjonen bestemmer nøyaktig **hva** det gjør.

Opprett en lokal plugin i `.opencode/plugins/quiz-tools.ts`, og registrer verktøyet `count_quiz_questions`. Det skal ha en tydelig beskrivelse, ikke ta argumenter og telle seedede spørsmål i `backend/src/main/resources/db/migration/V1__init_schema_and_seed.sql`.

Start OpenCode på nytt. Be deretter agenten svare på hvor mange spørsmål databasen starter med, og kontroller om den velger det nye verktøyet. Hvis den ikke gjør det, be den eksplisitt bruke `count_quiz_questions`; modellen velger selv verktøy ut fra navn, beskrivelse og oppgave.

Diskuter forskjellen mellom et custom tool og å la agenten kjøre en fri shell-kommando.

[Se løsningsforslag](../fasit/ekstra.md#c-custom-tool)

## 🧩 D. Bygg en kvalitetsport med hooks

En plugin utvider selve harnesset rundt modellen. Hooks reagerer deterministisk på hendelser eller verktøykall; de trenger ikke håpe at modellen husker en instruks. Lokale `.ts`- og `.js`-filer i `.opencode/plugins/` lastes automatisk ved oppstart.

`tool.execute.after` kjører etter at et verktøy er ferdig. Hooken får blant annet verktøynavnet i `input.tool` og argumentene i `input.args`. Dette er kraftig, men vær forsiktig: en hook kjøres ofte, bruker maskinen din, og en feil kan få selve verktøykallet til å feile.

Kliff Arne opprettet [`quality-gate.ts`](../../.opencode/plugins/quality-gate.ts). Foreløpig består kvalitetsporten av navnet og en kommentar, så den slipper gjennom absolutt alt.

### Del A: Se at hooken lever

1. Implementer `tool.execute.after` i pluginen.
2. Logg én kort melding når agenten har brukt et skriveverktøy. I workshopversjonen er de aktuelle navnene `edit`, `write` og `apply_patch`; `input.tool` viser navnet som faktisk ble brukt.
3. Start OpenCode på nytt fra reporoten. Bruk `opencode --print-logs` dersom loggmeldingen ikke er synlig med vanlig oppstart.
4. Be agenten gjøre en ufarlig endring, for eksempel legge til og fjerne en kommentar i en testfil. Finn loggmeldingen i terminalen der OpenCode kjører.

Bruk `console.log` i denne øvelsen fordi effekten er synlig. I en ekte plugin bør strukturert `client.app.log()` vurderes.

### Del B: Kjør lint på endrede frontendfiler

Utvid hooken slik at den kjører en kvalitetssjekk når en JavaScript- eller TypeScript-fil i `frontend/` er endret.

Krav:

- Kjør bare etter skriveverktøy.
- Hent filstien fra `input.args`. Vær defensiv: `edit` og `write` kan bruke `filePath` eller `path`, mens `apply_patch` kan inneholde flere filstier i `patchText`. Ignorer kall der du ikke finner en filsti.
- Ignorer filer utenfor `frontend/`.
- Ignorer filer som ikke har endelsen `.js`, `.jsx`, `.mjs`, `.ts` eller `.tsx`.
- Start enkelt med `volta run pnpm eslint <relativ-fil>` fra `frontend/`.
- Ikke kjør shell ved å bygge en ukontrollert kommandostreng. Bruk pluginens `$`-hjelper med interpolerte verdier.
- Logg hvilken sjekk som kjøres.

<details>
<summary>Hint</summary>

Pluginfunksjonen kan ta imot `{ $, worktree }`. Med Bun shell kan du angi arbeidsmappe og kjøre en kommando slik: ``await $`volta run pnpm eslint ${relativePath}`.cwd(frontendRoot)``. For en patch kan du hente filene fra linjer som starter med `*** Add File:` eller `*** Update File:`.

</details>

### Del C: Velg en produksjonsstrategi

Diskuter med sidemannen:

1. Bør hooken formatere automatisk eller bare rapportere feil?
2. Bør den kjøre etter hvert edit, eller samlet når et `session.status`-event melder at sesjonen er `idle`?
3. Hva skal skje dersom lint feiler?
4. Når er en hook bedre enn en instruks i `AGENTS.md`?

[Se løsningsforslag og refleksjon](../fasit/ekstra.md#d-hooks-og-kvalitetsport)

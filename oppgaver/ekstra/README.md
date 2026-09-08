# 🧩 Ekstraoppgaver

Disse oppgavene er mer åpne. Velg det som virker interessant; de bygger ikke på hverandre.

## 🧩 A. Mål kontekst før du fyller den

`AGENTS.md` ligger i grunnkonteksten, mens skills lastes ved behov og subagenter får egne samtaler. Mer kontekst er ikke gratis: den kan øke inputkostnad, fortrenge relevant informasjon og gjøre instruksjoner vanskeligere å følge. Samtidig kan for lite kontekst gi flere verktøykall og dyrere feil.

1. Lag to nye sesjoner med samme modell.
2. Be begge planlegge den samme lille API-endringen.
3. I den ene sesjonen gir du all prosjektinformasjon direkte i meldingen. I den andre lar du den forbedrede skillen finne og laste det som trengs.
4. Sammenlign antall verktøykall, synlig token-/kostnadsstatistikk, presisjon og mengden unødvendig output.
5. Flytt én sjelden regel fra `AGENTS.md` til riktig skill og forklar hvorfor.

Diskuter også cache: Identisk, stabil prompt-prefiks kan ofte caches av leverandøren, men cache gjør ikke irrelevant kontekst gratis eller ufarlig. Eksakt pris og cachepolitikk avhenger av valgt modell og leverandør.

[Se refleksjonsforslag](../fasit/ekstra.md#a-kontekst-og-kostnad)

## 🧩 B. Lag en repeterbar command

En command er en navngitt promptmal brukeren starter eksplisitt, for eksempel `/contract-check`. Den er nyttig for en kjent inngang til en arbeidsflyt. En skill velges av agenten ved behov; en hook kjører på en hendelse; en command velges av mennesket.

Opprett `.opencode/commands/contract-check.md` som:

- tar imot `$ARGUMENTS`
- bruker `contract-reviewer`
- ber om en skrivebeskyttet gjennomgang
- gir et stabilt outputformat

Start OpenCode på nytt og kjør `/contract-check quiz endpoint`.

[Se løsningsforslag](../fasit/ekstra.md#b-command)

## 🧩 C. Gi harnesset et custom tool

En plugin kan registrere et verktøy med kode og et argumentskjema. Modellen velger **om og når** verktøyet brukes, mens implementasjonen bestemmer nøyaktig **hva** det gjør.

Lag verktøyet `count_quiz_questions` i en ny lokal plugin. Det skal ikke ta argumenter, og det skal telle seedede spørsmål i `backend/src/main/resources/db/migration/V1__init_schema_and_seed.sql`. Be deretter agenten svare på hvor mange spørsmål databasen starter med.

Diskuter forskjellen mellom et custom tool og å la agenten kjøre en fri shell-kommando.

[Se løsningsforslag](../fasit/ekstra.md#c-custom-tool)

## 🧩 D. Bygg en kvalitetsport med hooks

En plugin utvider selve harnesset rundt modellen. Hooks reagerer deterministisk på hendelser eller verktøykall; de trenger ikke håpe at modellen husker en instruks. Lokale `.ts`- og `.js`-filer i `.opencode/plugins/` lastes automatisk ved oppstart.

`tool.execute.after` kjører etter at et verktøy er ferdig. Hooken får blant annet verktøynavn og argumentene verktøyet ble kalt med. Dette er kraftig, men vær forsiktig: en hook kjøres ofte, bruker maskinen din, og en feil kan få selve verktøykallet til å feile.

Kliff Arne opprettet [`quality-gate.ts`](../../.opencode/plugins/quality-gate.ts). Foreløpig består kvalitetsporten av navnet og en kommentar, så den slipper gjennom absolutt alt.

### Del A: Se at hooken lever

1. Implementer `tool.execute.after` i pluginen.
2. Logg én kort melding når agenten har brukt `edit`, `write` eller `apply_patch`.
3. Start OpenCode på nytt.
4. Be agenten gjøre en ufarlig endring, for eksempel legge til og fjerne en kommentar i en testfil. Finn loggmeldingen i terminalen der OpenCode kjører.

Bruk `console.log` i denne øvelsen fordi effekten er synlig. I en ekte plugin bør strukturert `client.app.log()` vurderes.

### Del B: Kjør lint på endrede frontendfiler

Utvid hooken slik at den kjører en kvalitetssjekk når en fil i `frontend/` er endret.

Krav:

- Kjør bare etter skriveverktøy.
- Hent filstien fra `input.args`. Vær defensiv: `edit` og `write` kan bruke `filePath` eller `path`, mens `apply_patch` kan inneholde flere filstier i `patchText`.
- Ignorer filer utenfor `frontend/`.
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
2. Bør den kjøre etter hvert edit, eller samlet ved `session.idle`?
3. Hva skal skje dersom lint feiler?
4. Når er en hook bedre enn en instruks i `AGENTS.md`?

[Se løsningsforslag og refleksjon](../fasit/ekstra.md#d-hooks-og-kvalitetsport)

# 🧩 Ekstraoppgaver

Disse oppgavene er mer åpne. Velg det som virker interessant; de bygger ikke på hverandre.

## 🧩 A. Prøvekjør skills og plugins fra fellesskapet

Det finnes mange ferdige utvidelser for agent-harness. [Skills.sh](https://skills.sh/) samler skills som kan brukes av blant annet OpenCode, mens OpenCode har en [offisiell oversikt over plugins og andre integrasjoner](https://opencode.ai/docs/ecosystem/). Popularitet er ikke det samme som kvalitet eller sikkerhet: En skill tilfører instrukser til modellen, en plugin kjører kode i OpenCode-prosessen, og en lokal eller ekstern MCP-server gir agenten nye verktøy og datakilder.

Velg minst **to skills** og **én plugin**. Aktuelle skills å prøve er:

- [`grill-me`](https://skills.sh/mattpocock/skills/grill-me), som utfordrer en idé eller plan med oppfølgingsspørsmål
- [`caveman`](https://skills.sh/juliusbrussee/caveman/caveman), som eksperimenterer med svært korte svar og lavere tokenbruk
- [`frontend-design`](https://skills.sh/anthropics/skills/frontend-design), for mer gjennomarbeidede grensesnitt
- [`systematic-debugging`](https://skills.sh/obra/superpowers/systematic-debugging), for strukturert feilsøking

For plugins kan du for eksempel undersøke [`opencode-dynamic-context-pruning`](https://github.com/Tarquinen/opencode-dynamic-context-pruning), [`opencode-notificator`](https://github.com/panta82/opencode-notificator) eller [`opencode-md-table-formatter`](https://github.com/franlol/opencode-md-table-formatter). Utvalget og installasjonsmåtene kan endre seg, så bruk alltid prosjektets egen dokumentasjon.

Prøv gjerne også [`CodeGraph`](https://github.com/colbymchenry/codegraph). Det er ikke en skill eller en vanlig OpenCode-plugin, men en lokal kodeindeks som kobles til OpenCode via MCP. Test om agenten bruker færre søk, fil-lesinger og verktøykall når den skal forklare en flyt eller finne konsekvensene av en kodeendring. Sammenlign også hvor mye kontekst som blir returnert i hvert kall.

1. Kjør først en liten test uten utvidelser og noter agentens oppførsel, antall verktøykall og synlig tokenbruk. Bruk samme modell og oppgave i resten av forsøket.
2. Les kildekoden og installasjonsinstruksene før du installerer noe. Se spesielt etter hooks, shell-kommandoer, nettverkstilgang, miljøvariabler og hvilke filer utvidelsen kan lese eller endre.
3. Installer og test **én utvidelse om gangen**. Bruk helst prosjektlokal konfigurasjon eller en midlertidig profil, og ikke legg inn hemmeligheter som øvelsen ikke trenger. Start OpenCode på nytt etter hver endring.
4. Kontroller at skillen faktisk blir aktivert, eller at pluginen eller MCP-integrasjonen faktisk gir den dokumenterte effekten. Sammenlign forsøket med baselinen og noter både nytte, kostnad og overraskelser.
5. Deaktiver eller fjern utvidelsen, start OpenCode på nytt og kontroller at effekten forsvinner. Ikke behold en utvidelse du ikke forstår eller trenger.

Diskuter til slutt: Hvilken effekt krevde bare instrukser og passet derfor som en skill? Hvilken effekt krevde hooks eller nye tools og passet som en plugin? Når er en ekstern MCP-server med en spesialisert datakilde riktigere? Hva måtte dere undersøkt grundigere før dere kunne brukt utvidelsen i et jobbprosjekt?

[Se refleksjonsforslag](./losningsforslag/99-ekstra-oppgaver.md#a-skills-og-plugins-fra-fellesskapet)

## 🧩 B. Lag commanden `/review-my-changes`

En command kan gjøre en nyttig arbeidsflyt enkel å gjenta. Kliff Arne har opprettet skjelettet [`.opencode/commands/review-my-changes.md`](../.opencode/commands/review-my-changes.md), men prompten gir foreløpig lite hjelp.

Fullfør commanden slik at `/review-my-changes` gjennomgår alle nåværende ucommittede endringer, inkludert staged, unstaged og nye filer. Reviewen skal hjelpe utvikleren å lære og forbedre sin egen kode, ikke bare godkjenne eller avvise den.

Krav:

- Ikke endre filer eller implementer forslag.
- Prioriter konkrete forbedringer innen korrekthet, tydelighet, vedlikeholdbarhet og tester.
- Forklar kort **hvorfor** hvert funn betyr noe, og foreslå en konkret forbedring.
- Bruk et kort og enkelt format med filreferanser. Begrens antall funn, og prioriter de viktigste.
- Trekk fram ett eller to gode grep som utvikleren kan bygge videre på.
- Si tydelig fra dersom det ikke finnes konkrete forbedringspunkter.
- La brukeren gi et valgfritt fokus etter command-navnet ved hjelp av `$ARGUMENTS`.

Start OpenCode på nytt, gjør en liten endring uten å committe den og kjør:

```text
/review-my-changes
```

Prøv deretter et valgfritt fokus, for eksempel `/review-my-changes særlig fokus på testene`. Vurder om svaret er kort, konkret og lærerikt nok til at du faktisk vet hva du bør gjøre videre.

Diskuter til slutt: Hvorfor er «vær kritisk» en dårligere instruks enn tydelige kriterier og et fast svarformat? Er en prompt som sier «ikke endre filer» en faktisk sikkerhetsgrense?

[Se løsningsforslag](./losningsforslag/99-ekstra-oppgaver.md#b-review-my-changes)

## 🧩 C. Mål kontekst før du fyller den

`AGENTS.md` ligger i grunnkonteksten, mens skills lastes ved behov og subagenter får egne samtaler. Mer kontekst er ikke gratis: den kan øke inputkostnad, fortrenge relevant informasjon og gjøre instruksjoner vanskeligere å følge. Samtidig kan for lite kontekst gi flere verktøykall og dyrere feil.

1. Lag to nye sesjoner med samme modell. Ikke be agentene endre filer.
2. Be begge planlegge den samme lille endringen: å legge til ett seedet quizspørsmål.
3. I den ene sesjonen gir du all relevant prosjektinformasjon direkte i meldingen og ber agenten om ikke å laste en skill. I den andre gir du bare den korte oppgaven og lar den forbedrede `quiz-expert`-skillen finne og laste det som trengs. Kontroller at skillen faktisk aktiveres.
4. Sammenlign antall verktøykall, synlig token-/kostnadsstatistikk, presisjon og mengden unødvendig output. Du kan bruke `opencode stats` før og etter hver kjøring dersom TUI-en ikke viser nok informasjon. Noter at én kjøring bare gir en indikasjon; modellvariasjon og cache kan påvirke resultatet.
5. Se etter en sjelden, spesialisert regel i `AGENTS.md` som passer bedre i en skill. Flytt den og forklar hvorfor. Hvis det ikke finnes en slik regel etter hovedoppgavene, foreslå et realistisk eksempel og forklar plasseringen uten å endre filene.

Diskuter også cache: Identisk, stabil prompt-prefiks kan ofte caches av leverandøren, men cache gjør ikke irrelevant kontekst gratis eller ufarlig. Eksakt pris og cachepolitikk avhenger av valgt modell og leverandør.

[Se refleksjonsforslag](./losningsforslag/99-ekstra-oppgaver.md#c-kontekst-og-kostnad)

## 🧩 D. Gi harnesset et custom tool

En plugin kan registrere et verktøy med kode og et argumentskjema. Modellen velger **om og når** verktøyet brukes, mens implementasjonen bestemmer nøyaktig **hva** det gjør.

Opprett en lokal plugin i `.opencode/plugins/quiz-tools.ts`, og registrer verktøyet `count_quiz_questions`. Det skal ha en tydelig beskrivelse, ikke ta argumenter og telle seedede spørsmål i `backend/src/main/resources/db/migration/V1__init_schema_and_seed.sql`.

Start OpenCode på nytt. Be deretter agenten svare på hvor mange spørsmål databasen starter med, og kontroller om den velger det nye verktøyet. Hvis den ikke gjør det, be den eksplisitt bruke `count_quiz_questions`; modellen velger selv verktøy ut fra navn, beskrivelse og oppgave.

Diskuter forskjellen mellom et custom tool og å la agenten kjøre en fri shell-kommando.

[Se løsningsforslag](./losningsforslag/99-ekstra-oppgaver.md#d-custom-tool)

## 🧩 E. Bygg en kvalitetsport med hooks

En plugin utvider selve harnesset rundt modellen. Hooks reagerer deterministisk på hendelser eller verktøykall; de trenger ikke håpe at modellen husker en instruks. Lokale `.ts`- og `.js`-filer i `.opencode/plugins/` lastes automatisk ved oppstart.

`tool.execute.after` kjører etter at et verktøy er ferdig. Hooken får blant annet verktøynavnet i `input.tool` og argumentene i `input.args`. Dette er kraftig, men vær forsiktig: en hook kjøres ofte, bruker maskinen din, og en feil kan få selve verktøykallet til å feile.

Kliff Arne opprettet [`quality-gate.ts`](../.opencode/plugins/quality-gate.ts). Foreløpig består kvalitetsporten av navnet og en kommentar, så den slipper gjennom absolutt alt.

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

[Se løsningsforslag og refleksjon](./losningsforslag/99-ekstra-oppgaver.md#e-hooks-og-kvalitetsport)

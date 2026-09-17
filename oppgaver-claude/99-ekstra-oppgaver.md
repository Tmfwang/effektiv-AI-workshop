# 🧩 Ekstraoppgaver

Disse oppgavene er mer åpne. Velg det som virker interessant; de bygger ikke på hverandre.

## 🧩 A. Prøvekjør skills og plugins fra fellesskapet

Claude Code kan utvides med skills, plugins og MCP-servere. En skill tilfører instrukser. En plugin er en distribusjonspakke som kan samle skills, subagenter, hooks og MCP-servere. En MCP-server tilbyr verktøy og datakilder gjennom en separat prosess eller tjeneste.

[Skills.sh](https://skills.sh/) samler skills som følger Agent Skills-formatet. Claude Code har også et [offisielt plugin-marked](https://github.com/anthropics/claude-plugins-official), som kan åpnes med `/plugin`. Popularitet er ikke det samme som kvalitet eller sikkerhet.

Aktuelle skills å undersøke:

- [`grill-me`](https://skills.sh/mattpocock/skills/grill-me)
- [`caveman`](https://skills.sh/juliusbrussee/caveman/caveman)
- [`frontend-design`](https://skills.sh/anthropics/skills/frontend-design)
- [`systematic-debugging`](https://skills.sh/obra/superpowers/systematic-debugging)

1. Kjør en liten baseline uten nye utvidelser. Noter oppførsel, verktøykall, svartid og det `/usage` og `/context` viser. `/cost` er et alias i nyere Claude Code.
2. Åpne `/plugin`, eller les installasjonsinstruksene for en skill. Undersøk kildekode, hooks, shell-kommandoer, nettverkstilgang, miljøvariabler og filtilgang før installasjon.
3. Test én utvidelse om gangen. Bruk prosjektlokalt oppsett eller en midlertidig clone, og ikke gi den hemmeligheter øvelsen ikke trenger.
4. Kjør `/reload-plugins` når Claude Code ber om det. Etter at du har installert eller endret en vanlig skill, må du starte Claude Code på nytt.
5. Kontroller faktisk effekt mot baselinen. Deaktiver eller fjern utvidelsen etterpå, og kontroller at effekten forsvinner.

Diskuter når en instruks bør være en skill, når en pakke med flere Claude-komponenter bør være en plugin, og når et eksternt verktøy bør være en MCP-server.

[Se refleksjonsforslag](./losningsforslag/99-ekstra-oppgaver.md#a-skills-og-plugins-fra-fellesskapet)

## 🧩 B. Lag skillen `/review-my-changes`

I Claude Code er custom commands slått sammen med skills. Det eldre `.claude/commands/`-formatet virker fortsatt, men nye arbeidsflyter bør ligge i `.claude/skills/<navn>/SKILL.md`.

Kliff Arne har opprettet skjelettet [`.claude/skills/review-my-changes/SKILL.md`](../.claude/skills/review-my-changes/SKILL.md). Fullfør det slik at `/review-my-changes` gjennomgår staged, unstaged og nye filer.

Krav:

- Behold `disable-model-invocation: true`, slik at bare brukeren starter reviewen.
- Kjør skillen i en separat, skrivebeskyttet Explore-kontekst med `context: fork` og `agent: Explore`.
- Behold `disallowed-tools: Edit, Write, NotebookEdit` som ekstra vern.
- Hent `git status --short`, vanlig diff og staged diff med dynamisk kontekst i formen `` !`kommando` ``.
- Ikke endre filer eller implementer forslag.
- Prioriter korrekthet, tydelighet, vedlikeholdbarhet og tester.
- Forklar hvorfor hvert funn betyr noe, og bruk filreferanser.
- Begrens antall funn, trekk fram gode grep og bruk `$ARGUMENTS` som valgfritt fokus.

Gjør en liten, ucommittet endring og kjør:

```text
/review-my-changes
/review-my-changes særlig fokus på testene
```

Diskuter hvorfor tydelige kriterier er bedre enn «vær kritisk», og hvorfor `disallowed-tools` er nyttig selv om Explore-agenten allerede er skrivebeskyttet.

[Se løsningsforslag](./losningsforslag/99-ekstra-oppgaver.md#b-review-my-changes)

## 🧩 C. Mål kontekst før du fyller den

`CLAUDE.md` ligger i grunnkonteksten, skills lastes ved behov og subagenter får egne kontekstvinduer. Mer kontekst kan øke tokenbruk, fortrenge relevant informasjon og gjøre instrukser vanskeligere å følge.

1. Lag to separate samtaler med `/clear`, og bruk samme modell og effort.
2. Be begge planlegge den samme lille endringen: ett seedet quizspørsmål. Ikke endre filer.
3. I den ene samtalen limer du inn all relevant prosjektinformasjon og ber Claude ikke bruke en skill. I den andre gir du bare oppgaven og lar `quiz-expert` aktiveres.
4. Sammenlign `/context`, `/usage`, verktøykall, svartid, presisjon og unødvendig output. `/cost` er et alias for `/usage` i nyere Claude Code. Kontotype og cache avgjør hvilke tall som er tilgjengelige, så én kjøring er bare en indikasjon.
5. Se etter en sjelden regel i `CLAUDE.md` som passer bedre i en skill. Hvis det ikke finnes en, foreslå et realistisk eksempel uten å endre filene.

[Se refleksjonsforslag](./losningsforslag/99-ekstra-oppgaver.md#c-kontekst-og-kostnad)

## 🧩 D. Gi Claude Code et custom tool

Claude Code-plugins har ikke et innebygd TypeScript-API som registrerer vilkårlige tools i Claude Code-prosessen. Et eget, smalt verktøy eksponeres i stedet gjennom MCP. I denne oppgaven lager du en lokal stdio-server med den offisielle TypeScript-SDK-en.

1. Opprett `.claude/mcp/quiz-tools/`.
2. Opprett et privat ESM-prosjekt der og installer `@modelcontextprotocol/sdk@1.29.0` og `zod`.
3. Lag `index.mjs` med `McpServer` og `StdioServerTransport`.
4. Registrer verktøyet `count_quiz_questions` med tydelig beskrivelse og tomt input-schema.
5. La implementasjonen lese `backend/src/main/resources/db/migration/V1__init_schema_and_seed.sql` under `CLAUDE_PROJECT_DIR`, telle spørsmålene i `INSERT INTO questions` og returnere tekstinnhold.
6. Legg serveren `quiz-tools` til i `.mcp.json`. Start den med `node` og en sti som bruker `${CLAUDE_PROJECT_DIR:-.}`.
7. Godkjenn serveren i `/mcp`, og spør hvor mange spørsmål databasen starter med. Be eksplisitt om `count_quiz_questions` hvis Claude ikke velger det selv.

Ikke skriv vanlig logg til stdout i en stdio MCP-server; stdout er protokollkanalen. Diskuter forskjellen mellom dette avgrensede verktøyet og fri Bash-tilgang.

[Se løsningsforslag](./losningsforslag/99-ekstra-oppgaver.md#d-custom-tool-med-mcp)

## 🧩 E. Bygg en kvalitetsport med hooks

Hooks reagerer deterministisk på hendelser i Claude Code. Prosjektets [`.claude/settings.json`](../.claude/settings.json) registrerer allerede [`.claude/hooks/quality-gate.mjs`](../.claude/hooks/quality-gate.mjs) som en `PostToolUse`-hook for `Edit|Write`, men scriptet gjør foreløpig ingenting.

Claude Code sender JSON til hooken på stdin. For verktøyhooks inneholder den blant annet `tool_name` og `tool_input`. En `PostToolUse`-hook kjører etter at verktøyet lyktes; den kan gi Claude feedback, men kan ikke gjøre den fullførte redigeringen ugjort.

### Del A: Se at hooken lever

1. Les JSON fra stdin i `quality-gate.mjs`.
2. Logg én kort melding til stderr med `tool_name`.
3. Start Claude Code med `claude --debug`, og be Claude gjøre en ufarlig endring. En hook som avslutter med kode `0`, sender bare stderr til debugloggen; meldingen vises ikke i det vanlige transcriptet.
4. Bruk `/hooks` og `/status` for å kontrollere at prosjektinnstillingen er lastet.

### Del B: Kjør lint på endrede frontendfiler

Utvid hooken slik at den kjører en kvalitetssjekk etter endring av JavaScript- eller TypeScript-filer i `frontend/`.

Krav:

- Hent `file_path` fra `tool_input`, og ignorer kall uten filsti.
- Normaliser stien og avvis alt utenfor `frontend/`.
- Godta bare `.js`, `.jsx`, `.mjs`, `.ts` og `.tsx`.
- Kjør for eksempel `volta run pnpm eslint -- src/components/quiz-app.tsx` fra `frontend/`, og erstatt stien med fila hooken mottok. Ikke lim inn `<relativ-fil>` bokstavelig; vinkelparentesene er en plassholder.
- Bruk `spawnSync` eller `execFile`, med argumentarray. Ikke bygg en shellstreng fra filstien.
- Returner exitkode `2` og skriv lint-output til stderr ved feil, slik at Claude får feedback. Returner `0` ellers.

### Del C: Velg en produksjonsstrategi

Diskuter:

1. Bør hooken formatere automatisk eller bare rapportere feil?
2. Bør den kjøre etter hver filendring, etter en hel verktøybatch eller ved `Stop`?
3. Hva skal skje dersom lint feiler?
4. Når er en hook bedre enn en instruks i `CLAUDE.md`?
5. Hvilke hooks tillater organisasjonens administrerte Claude Code-policy?

[Se løsningsforslag og refleksjon](./losningsforslag/99-ekstra-oppgaver.md#e-hooks-og-kvalitetsport)

# 🧩 5. Bygg kvalitetsporten

En plugin utvider selve harnesset rundt modellen. Hooks reagerer deterministisk på hendelser eller verktøykall; de trenger ikke håpe at modellen husker en instruks. Lokale `.ts`- og `.js`-filer i `.opencode/plugins/` lastes automatisk ved oppstart.

`tool.execute.after` kjører etter at et verktøy er ferdig. Hooken får blant annet verktøynavn og argumentene verktøyet ble kalt med. Dette er kraftig, men vær forsiktig: en hook kjøres ofte, bruker maskinen din, og en feil kan få selve verktøykallet til å feile.

Kliff Arne opprettet [`quality-gate.ts`](../.opencode/plugins/quality-gate.ts). Foreløpig består kvalitetsporten av navnet og en kommentar, så den slipper gjennom absolutt alt.

### 🧩 Oppgave 5A: Se at hooken lever

1. Implementer `tool.execute.after` i pluginen.
2. Logg én kort melding når agenten har brukt `edit`, `write` eller `apply_patch`.
3. Start OpenCode på nytt.
4. Be agenten gjøre en ufarlig endring, for eksempel legge til og fjerne en kommentar i en testfil. Finn loggmeldingen i terminalen der OpenCode kjører.

Bruk `console.log` i denne øvelsen fordi effekten er synlig. I en ekte plugin bør strukturert `client.app.log()` vurderes.

[Se løsningsforslag for oppgave 5A](./fasit/05-hooks.md#del-a)

## Fra hendelse til kvalitetssjekk

Instruksjoner i `AGENTS.md` kan be modellen huske å kjøre lint. En hook gjør reaksjonen deterministisk: når en bestemt hendelse skjer, kjører kode. Til gjengjeld blir hooken en del av verktøyets kontrollflyt. Den kan gjøre hvert edit-kall tregere, og en ukontrollert feil kan få verktøykallet til å feile.

### 🧩 Oppgave 5B: Kjør lint på endrede frontendfiler

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

[Se løsningsforslag for oppgave 5B](./fasit/05-hooks.md#del-b)

## Når bør hooken kjøre?

Hooken over kan starte én lintprosess per filendring. Ti raske edits kan dermed gi ti prosesser og merkbar ventetid. En annen løsning er å samle filer og kjøre én sjekk når sesjonen blir inaktiv, eller å la hooken rapportere hva som bør sjekkes uten å endre noe.

### 🧩 Oppgave 5C: Velg en produksjonsstrategi

Diskuter med sidemannen:

1. Bør hooken formatere automatisk eller bare rapportere feil?
2. Bør den kjøre etter hvert edit, eller samlet ved `session.idle`?
3. Hva skal skje dersom lint feiler?
4. Når er en hook bedre enn en instruks i `AGENTS.md`?

[Se refleksjonsforslag for oppgave 5C](./fasit/05-hooks.md#produksjonsstrategi)

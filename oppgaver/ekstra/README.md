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

## 🧩 D. Koble til et MCP-verktøy med minst mulig tillit

MCP standardiserer hvordan en agent finner og kaller verktøy eller datakilder utenfor OpenCode. Det utvider kapasiteten, men også angrepsflaten, konteksten og kostnaden.

1. Velg en ufarlig MCP-server dere allerede bruker eller stoler på, for eksempel en dokumentasjons- eller nettleserserver.
2. Legg den til i [`opencode.jsonc`](../../opencode.jsonc) etter den offisielle [MCP-dokumentasjonen](https://opencode.ai/docs/mcp-servers/).
3. Begrens hvilke agenter som får kalle verktøyene med `permission`.
4. Test ett eksplisitt kall og se hvilke nye verktøy agenten får presentert.
5. Deaktiver serveren igjen med `enabled: false`.

Ikke legg tokens direkte i filen. Bruk miljøvariabelreferanse dersom serveren krever autentisering. Ikke bruk en tilfeldig MCP-server bare for å fullføre oppgaven.

[Se refleksjonsforslag](../fasit/ekstra.md#d-mcp)

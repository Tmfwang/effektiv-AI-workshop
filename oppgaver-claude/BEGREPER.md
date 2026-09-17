# Begreper i workshoppen

## Bruk og kostnad

Claude Code kan brukes gjennom abonnement, API-forbruk eller en støttet skytilbyder. `/usage` viser informasjonen som er tilgjengelig for kontotypen din; `/cost` er et alias i nyere versjoner. API-kostnader avhenger vanligvis av modell, input, output og cache, mens abonnementsbruk ikke kan leses direkte som en fakturert dollarverdi.

## Token

En token er en liten tekstdel som en AI-modell leser eller produserer. En token kan være et helt ord, en del av et ord, et tegn eller tegnsetting, avhengig av modellen. Mengden input- og output-tokens brukes ofte til å beregne kostnad og avgjør hvor mye som får plass i modellens kontekstvindu.

## Kontekstvindu

Kontekstvinduet er hvor mange tokens en modell sender med i ett modell-kall. Det rommer blant annet instrukser, samtalehistorikk, verktøyresultater og brukerens melding, samt plassen som trengs for modellens svar. Når vinduet blir fullt, må harnesset forkorte, oppsummere eller fjerne eldre innhold før samtalen kan fortsette.

## `CLAUDE.md`

`CLAUDE.md` inneholder prosjektinstruksjoner som Claude Code får med i grunnkonteksten. Den passer best for korte regler som gjelder alt eller det meste av arbeidet i repoet.

## Skills

En skill er spesialiserte instruksjoner som agenten kan laste når en bestemt type oppgave skal løses. Dette holder grunnkonteksten mindre fordi hele skillen ikke lastes før den er relevant.

## Hovedagent, orkestrator og subagent

Hovedagenten snakker med brukeren og fungerer som orkestrator når den fordeler avgrensede oppgaver. En subagent arbeider i en egen samtalekontekst og kan ha egne instrukser, verktøy, permissions og modell.

## MCP

Model Context Protocol (MCP) er en standard for å koble AI-agenter til eksterne verktøy og datakilder. En MCP-server kan for eksempel gi agenten tilgang til en nettleser, dokumentasjon eller et fagsystem.

## Kontekst, cache, input og output

Kontekst er informasjonen modellen mottar i et kall: input består av blant annet instrukser, samtalehistorikk og verktøyresultater, mens output er det modellen produserer. En leverandør kan cache et stabilt prefiks av inputen for raskere eller billigere gjenbruk, men cache gjør ikke irrelevant kontekst ufarlig.

## Modellkostnader

Modellkostnader beregnes vanligvis fra mengden input- og output-tokens, valgt modell og eventuell cache. En billig modell kan likevel bli dyr dersom den trenger mange forsøk eller produserer unødvendig mye tekst.

## Scripting og tools (verktøy)

Et **tool** er en navngitt funksjon agenten kan velge å kalle med strukturerte argumenter, mens scripting ofte betyr at agenten skriver eller kjører friere kode og shell-kommandoer. I workshoppen bruker vi `tool` om det tekniske Claude Code-begrepet og **verktøy** som norsk oversettelse. Ordet verktøy kan ellers brukes bredere om for eksempel shell, nettlesere og integrasjoner. Tools gir vanligvis en smalere og mer forutsigbar grense enn generell scripting.

## Harness

Et harness er applikasjonen og infrastrukturen rundt modellen som håndterer kontekst, instrukser, verktøy, permissions og arbeidsflyt. Claude Code er harnesset som brukes i denne workshoppen.

## Commands

En command er en navngitt arbeidsflyt som brukeren starter eksplisitt, for eksempel `/contract-check`. I Claude Code lages nye commands som skills under `.claude/skills/`; det eldre `.claude/commands/`-formatet støttes fortsatt.

## Plugins

En Claude Code-plugin er en distribusjonspakke som kan samle skills, subagenter, hooks og MCP-servere. Kjørbar logikk ligger vanligvis i et hookscript eller en MCP-server, ikke i et eget plugin-API inne i Claude Code-prosessen.

## Hooks

En hook er kode som reagerer automatisk på en bestemt hendelse, for eksempel etter at et verktøy har endret en fil. Hooks passer når en kontroll eller reaksjon skal skje deterministisk i stedet for å være avhengig av at modellen husker en instruks.

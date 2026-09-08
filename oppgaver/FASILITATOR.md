# Fasilitatornotater

## Mål

Deltakerne skal forstå:

- forskjellen på instrukser, skills, subagenter og MCP-servere
- at kontekst bør lastes når den trengs
- at permissions er en sikkerhetsgrense
- når delegering og verktøybruk er verdt kostnaden

## Kjøreplan

| Tid | Aktivitet |
| --- | --- |
| 0-10 min | Oppgave 0: innlogging, modell, status og sesjoner |
| 10-15 min | Oppgave 1: la deltakerne oppdage dialekten selv |
| 15-30 min | Oppgave 2-3: jobb to og to med skills |
| 30-40 min | Oppgave 4: vis subagentens child session |
| 40-55 min | Oppgave 5: koble til Chrome DevTools og undersøk quiz-appen |
| 55-60 min | Diskuter datatilgang og når MCP bør være aktiv |

For 30 minutter: gjør oppgave 0, 1, 2 og 5A. Demonstrer oppgave 4 og ett nettleserkall fra 5B.

## Viktige fallgruver

- Start OpenCode på nytt etter endringer i konfigurasjon, agents, skills, plugins eller MCP.
- Skill-aktivering kan variere fordi den styres av modellen.
- Første MCP-oppstart kan ta tid fordi `npx` laster ned pakken.
- Bruk `opencode mcp list` ved tilkoblingsproblemer.
- Quiz-appen må kjøre i oppgave 5B. Bruk `https://example.com` som reserve.

## Før workshoppen

1. Bekreft at OpenCode, Chrome og `npx` er tilgjengelig.
2. Bekreft modelltilgang og hjelp med innlogging ved behov.
3. Installer frontendavhengighetene og test quiz-appen.
4. Test MCP-pakken på workshop-nettverket.
5. Start OpenCode fra reporoten og bekreft at `quiz-expert` og `quiz-sheriff` vises.

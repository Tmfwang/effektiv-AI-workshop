# 🧩 4. Avgrens quiz-sheriffen

Hovedagenten fungerer som orkestrator: den snakker med deg, holder oversikt og kan delegere avgrenset arbeid. En subagent får en egen kontekst og kan spesialiseres med prompt, modell, verktøy og permission mode. Det kan gi bedre fokus og mindre støy i hovedkonteksten, men delegering koster ekstra input, output og tid.

[Kliff Arnes `quiz-sheriff`](../.claude/agents/quiz-sheriff.md) «håndterer alt» og har tilgang til lesing, redigering, shell, nett og videre delegering. Navnet høres spesialisert ut; konfigurasjonen er ikke det.

> [!TIP]
> En subagent kan bruke en rimeligere modell enn hovedagenten. En enkel, skrivebeskyttet kontroll trenger sjelden den kraftigste modellen kontoen tilbyr.

### 🧩 Oppgave 4A: Undersøk sheriffen

1. Åpne [`quiz-sheriff.md`](../.claude/agents/quiz-sheriff.md), og finn `name`, `description`, `tools` og `model`.
2. Velg `quiz-sheriff (agent)` fra `@`-menyen i Claude Code, og be om en rask skrivebeskyttet kontroll av OpenAPI-kontrakten mot backend-rutene.
3. Legg merke til om svaret er avgrenset, og hvilke handlinger agenten kunne ha utført selv om du ba om en skrivebeskyttet kontroll.

Poenget er å oppdage at prompten alene ikke begrenser verktøytilgangene.

## Delegering har en kostnad

Subagenten behandler oppgaven, relevante instrukser og kildemateriale i et separat kontekstvindu. Det kan lønne seg når store søke- eller testresultater ellers ville fulgt hovedsamtalen videre. Hvis hovedagenten allerede har nødvendig kontekst og oppgaven er liten, gir delegering ofte bare mer arbeid.

## Minste privilegium

`tools` er en allowlist over verktøy subagenten kan få. En liste med bare `Read`, `Grep` og `Glob` gjør denne subagenten skrivebeskyttet; `permissionMode: plan` forsterker arbeidsmåten. En kort prompt om å «ikke redigere» er fortsatt nyttig for hensikten, men er ikke den tekniske sikkerhetsgrensen.

### 🧩 Oppgave 4B: Lag en skrivebeskyttet anmelder

Gjør [`quiz-sheriff.md`](../.claude/agents/quiz-sheriff.md) om til en avgrenset, skrivebeskyttet reviewer av API-kontrakten:

1. Endre filnavnet til `.claude/agents/contract-reviewer.md`.
2. Sett `name: contract-reviewer` og skriv en presis norsk `description` som hjelper orkestratoren å delegere riktig.
3. Sett `model: haiku` for å rute den mekaniske kontrollen til en rask modell. Claude Code bruker en tillatt reserve hvis organisasjonen blokkerer modellen.
4. Sett `tools: Read, Grep, Glob` og `permissionMode: plan`.
5. Skriv en kort prompt som ber om funn prioritert etter alvorlighetsgrad, med filreferanser, og som tydelig sier at agenten ikke skal implementere.

   Prøv denne prompten:

   ```text
   Gjennomgå OpenAPI-kontrakten mot backend-rutene. Rapporter kun funn, prioritert etter alvorlighetsgrad, og oppgi fil- og linjereferanser for hvert funn. Ikke implementer eller endre noe.
   ```

Start Claude Code på nytt etter at du har opprettet eller endret en subagent. Bruk deretter `@`-menyen for å kontrollere at den nye agenten finnes. Ved problemer kan du kjøre `/doctor` eller `claude plugin validate .claude/agents`.

[Se løsningsforslag for oppgave 4B](./losningsforslag/04-subagent.md)

## Manuell og automatisk delegering

Du kan velge en subagent direkte fra `@`-menyen. Claude Code viser den som for eksempel `contract-reviewer (agent)`. Hovedagenten kan også velge den automatisk ut fra `description`.

### 🧩 Oppgave 4C: Sammenlign delegering

Prøv begge variantene:

```text
@"contract-reviewer (agent)" Kontroller om OpenAPI-kontrakten og backend-rutene ser konsistente ut. Ikke gjør endringer.
```

```text
Undersøk om OpenAPI-kontrakten og backend-rutene er konsistente. Deleger kontraktgjennomgangen til riktig subagent. Ikke gjør endringer.
```

Sammenlign manuell delegering med orkestratorens valg. Bruk `/tasks` mens subagenten kjører hvis du vil se modell og status. Ble oppgaven avgrenset, og kom resultatet tilbake i en nyttig form?

[Se løsningsforslaget for subagenten](./losningsforslag/04-subagent.md) dersom du vil kontrollere verktøy og prompt.

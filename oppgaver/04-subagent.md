# 🧩 4. Avgrens quiz-sheriffen

Hovedagenten er orkestratoren: den snakker med deg, holder oversikt og kan delegere avgrenset arbeid. En subagent får en egen kontekst og kan spesialiseres med prompt, modell og permissions. Det kan gi bedre fokus og mindre støy i hovedkonteksten, men delegering har også en kostnad: mer input, mer output og risiko for dobbeltarbeid.

Kliff Arnes [`quiz-sheriff`](../.opencode/agents/quiz-sheriff.md) «håndterer alt», har høy kreativitet og kan både redigere og kjøre vilkårlige kommandoer. Navnet høres spesialisert ut; konfigurasjonen er det ikke.

### 🧩 Oppgave 4A: Undersøk sheriffen

1. Åpne `quiz-sheriff.md` og finn beskrivelse, temperatur og permissions.
2. Kall den manuelt med `@quiz-sheriff` og be om en skrivebeskyttet kontroll av OpenAPI-kontrakten mot backend-rutene.
3. Legg merke til om svaret er avgrenset, og hvilke handlinger agenten kunne ha utført selv om du ba om en skrivebeskyttet kontroll.

Bruk observasjonene dine som utgangspunkt for oppgave 4B. Det finnes ikke en separat fasit for inspeksjonen; poenget er å oppdage at prompten alene ikke begrenser verktøytilgangen.

## Delegering har en kostnad

Anta at hovedagenten delegerer en kontraktgjennomgang. Subagenten får 500 tokens med oppgave og instrukser, leser 4 000 tokens med kontrakt og kode, og returnerer 1 000 output-tokens. Med tenkte priser på 3 dollar per million input-tokens og 15 dollar per million output-tokens koster underoppgaven omtrent **0,014 dollar i input og 0,015 dollar i output**, i tillegg til hovedagentens egne kall.

Det ekstra kallet kan likevel lønne seg. Hvis subagenten holder 10 000 tokens med detaljer ute av hovedsamtalen, slipper disse detaljene å følge med i for eksempel fem senere hovedkall. Det kan spare opptil 50 000 tokens med rå input før cache. Hvis hovedagenten allerede har all nødvendig kontekst og oppgaven er liten, gir delegeringen derimot bare ekstra input, output og ventetid.

Subagentens kontekst er separat, men ikke gratis. Orkestratoren må beskrive oppgaven, subagenten må hente relevant materiale, og resultatet må sendes tilbake til hovedkonteksten. En kort og presis delegering reduserer både kostnad og risiko for dobbeltarbeid.

## Prompt er ikke en sikkerhetsgrense

En prompt kan be agenten om å la være å redigere, men permissions avgjør hvilke verktøy den faktisk får bruke. Minste privilegium betyr at subagenten bare får kapabilitetene oppgaven krever. Det begrenser skade dersom prompten er uklar eller konteksten inneholder dårlige instrukser.

### 🧩 Oppgave 4B: Lag en skrivebeskyttet anmelder

Gjør subagenten til en **avgrenset, skrivebeskyttet kontraktanmelder**:

1. Endre navn på filen til `contract-reviewer.md`.
2. Skriv en presis norsk `description` som hjelper orkestratoren å delegere riktig.
3. Sett lav temperatur.
4. Nekt filendringer.
5. Tillat bare lesing og søk. Nekt shell og nettilgang.
6. Skriv en kort prompt som ber om funn prioritert etter alvorlighetsgrad, med filreferanser, og som tydelig sier at agenten ikke skal implementere.

<details>
<summary>Hint</summary>

Bruk `mode: subagent` og `permission`. Start med å nekte alt, og tillat deretter bare lesing og søk. Du trenger ikke velge modell; uten modell arver subagenten modellen til hovedagenten.

</details>

[Se løsningsforslag for oppgave 4B](./fasit/04-subagent.md)

## Manuell og automatisk delegering

Du kan kalle en subagent direkte med `@navn`. Hovedagenten kan også velge den automatisk ut fra `description`. I det siste tilfellet fungerer hovedagenten som orkestrator: den avgrenser oppgaven, mottar resultatet og bruker det videre i hovedsamtalen.

### 🧩 Oppgave 4C: Sammenlign delegering

Start OpenCode på nytt og prøv begge variantene:

```text
@contract-reviewer Kontroller om OpenAPI-kontrakten og backend-rutene ser konsistente ut. Ikke gjør endringer.
```

```text
Undersøk om OpenAPI-kontrakten og backend-rutene er konsistente. Deleger kontraktgjennomgangen til riktig subagent. Ikke gjør endringer.
```

Sammenlign manuell delegering med orkestratorens valg. Ble oppgaven avgrenset? Kom resultatet tilbake i en nyttig form?

Det finnes ikke ett riktig svar på sammenligningen. Se [løsningsforslaget for subagenten](./fasit/04-subagent.md) dersom du vil kontrollere permissions og prompt.

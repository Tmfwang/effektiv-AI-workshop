# 🧩 4. Avgrens quiz-sheriffen

Hovedagenten kalles for *orkestratoren*: den snakker med deg, holder oversikt og kan delegere avgrenset arbeid. En subagent får en egen kontekst og kan spesialiseres med prompt, modell og permissions. Det kan gi bedre fokus og mindre støy i hovedkonteksten, men delegering har også en kostnad: mer input, mer output og risiko for dobbeltarbeid.

[Kliff Arnes `quiz-sheriff`](../.opencode/agents/quiz-sheriff.md) «håndterer alt», har høy kreativitet og kan både redigere og kjøre vilkårlige kommandoer. Navnet høres spesialisert ut; konfigurasjonen er ikke det.

> [!TIP]
> Man kan låse subagenter til å alltid bruke én spesifik modell, som gjør det mulig å alltid delegere enklere oppgaver til en *langt* billigere modell, og dermed spare *mye* kostnadsmessig! For eksempel, så trenger man ikke få Opus 5 til å kjøre opp appen din; det kan en mye billigere modell klare helt uten problemer.

### 🧩 Oppgave 4A: Undersøk sheriffen

1. Åpne [`quiz-sheriff.md`](../.opencode/agents/quiz-sheriff.md) og finn beskrivelse, temperatur og permissions.
2. Kall den manuelt i OpenCode-sesjonen med `@quiz-sheriff` og be om en rask skrivebeskyttet kontroll av OpenAPI-kontrakten mot backend-rutene.
3. Legg merke til om svaret er avgrenset, og hvilke handlinger agenten kunne ha utført selv om du ba om en skrivebeskyttet kontroll.

Bruk observasjonene dine som utgangspunkt for oppgave 4B. Det finnes ikke en separat fasit for inspeksjonen; poenget er å oppdage at prompten alene ikke begrenser verktøytilgangene.

> [!TIP]
> `temperature` er et tall mellom 0 og 1 som bestemmer hvor variert og uforutsigbart subagenten svarer. Jo lavere verdi desto mer forutsigbar blir den, og for en subagent som skal gjøre presise handlinger, er for eksempel 0.1 en fin verdi.

## Delegering har en kostnad

Delegering til en subagent koster ekstra fordi oppgaven, kildematerialet og svaret må behandles i en separat kontekst. Det kan likevel lønne seg dersom subagenten hindrer store mengder detaljer i å følge med gjennom flere senere kall.

Hvis hovedagenten allerede har nødvendig kontekst og oppgaven er liten, vil delegering som regel bare gi høyere kostnad og lengre ventetid. Derfor bør oppdraget til subagenten være kort, presist og avgrenset.

## Prompt er ikke en sikkerhetsgrense

En prompt kan be agenten om å la være å redigere, men permissions avgjør hvilke verktøy den faktisk får bruke. Minste privilegium betyr at subagenten bare får kapabilitetene oppgaven krever. Det begrenser skade dersom prompten er uklar eller konteksten inneholder dårlige instrukser.

### 🧩 Oppgave 4B: Lag en skrivebeskyttet anmelder

Gjør subagenten [`quiz-sheriff.md`](../.opencode/agents/quiz-sheriff.md) om til en **avgrenset, skrivebeskyttet reviewer av API-kontrakten**, som har som oppgave å sjekke om alle API-endepunktene i backenden ligger riktig definert i OpenAPI-kontrakten:

1. Endre navn på filen til `contract-reviewer.md`.
2. Skriv en presis norsk `description` som hjelper orkestratoren å delegere riktig.
3. Sett lav temperatur, slik at subagenten blir mer forutsigbar.
4. Oppdater `permissions` slik at subagenten kun får lov til å lese filer (`read`) og søke i filer (herunder `grep`, `glob` og `list`), nekt alt annet.
5. Skriv en kort prompt som ber om funn prioritert etter alvorlighetsgrad, med filreferanser, og som tydelig sier at agenten ikke skal implementere.

   Prøv denne prompten:

   ```text
   Gjennomgå OpenAPI-kontrakten mot backend-rutene. Rapporter kun funn, prioritert etter alvorlighetsgrad, og oppgi fil- og linjereferanser for hvert funn. Ikke implementer eller endre noe.
   ```

<details>
<summary>Hint</summary>

Bruk `mode: subagent` og `permission`. Start med å nekte alt, og tillat deretter bare lesing og søk. Du trenger ikke velge modell; uten modell arver subagenten modellen til hovedagenten.

</details>

> [!TIP]
> Du kan få et forslag fra agenten på hva *instruksjonene* for denne subagenten bør være, eller hvordan du setter de ulike konfigurasjonene (og hva de betyr). Her kan du også prøve ut OpenCode
sin `Plan`-modus (ved å trykke på Tab-tasten inne i sesjonen) dersom du ønsker!


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

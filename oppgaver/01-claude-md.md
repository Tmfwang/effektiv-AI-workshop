# 🧩 1. Fjern den interne spøken

`CLAUDE.md` er repoets faste instruksjonssett til Claude Code. Den lastes inn i relevante samtaler, så én kort setning kan påvirke hver forklaring, hvert kodeforslag og hver vanlig custom subagent. Det er nyttig for stabile prosjektregler, men dyrt og forstyrrende for trivia, personlighet og regler som bare gjelder én sjelden arbeidsflyt.

### 🧩 Oppgave 1A: Se instruksen i praksis

1. Tøm samtalen med `/clear`, eller start en ny Claude Code-sesjon.
2. Spør: `Forklar kort de fem viktigste delene man bør vite om dette repoet.`
3. Legg merke til både innholdet og måten agenten svarer på.

Etter en intern spøk la teammedlemmet ditt, Kliff Arne, inn litt tvungen folkeopplysning om Narvik i [`CLAUDE.md`](../CLAUDE.md). Nå følger spøken med inn i alle svar, også kodegjennomganger og feilforklaringer. Det var artig én gang. Problemet er at en lokal vits har blitt en global instruks; ikke bare må alle forholde seg til en AI-agent med Narvik-dialekt, men alle funfactsene den kommer med øker konteksten og kostnaden!

## Fast kontekst har en kostnad

`CLAUDE.md` blir tatt med i konteksten når Claude Code arbeider i repoet. Modelltilbyderen kan ofte cache deler av denne konteksten, slik at gjentakelsen blir billigere. Men innholdet tar fortsatt plass i kontekstvinduet og kan påvirke hvert svar. Derfor bør `CLAUDE.md` være kort og inneholde regler som faktisk gjelder for hele repoet.


### 🧩 Oppgave 1B: Rydd i `CLAUDE.md`

1. Les [`CLAUDE.md`](../CLAUDE.md), og fjern dialektinstruksen.
2. Erstatt den med **maksimalt fem korte, norske linjer** som er nyttige på tvers av hele repoet, basert på hva agenten sa i forrige oppgave.
3. Avslutt Claude Code og start det på nytt, slik at endringen i `CLAUDE.md` lastes inn. Still deretter samme spørsmål som i oppgave 1A.
4. Sammenlign svarene. Hvilken oppførsel endret seg?



> [!TIP]
> Tenk spesielt på dette:
> - Hvilken informasjon bør alltid ligge i konteksten?
> - Hva kan agenten finne selv når den trenger det?
> - Hvilke regler forhindrer kostbare feil, som å redigere generert kode som allikevel blir overskrevet?


[Se løsningsforslag for oppgave 1B](./losningsforslag/01-claude-md.md)

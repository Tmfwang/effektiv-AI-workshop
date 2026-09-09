# Løsningsforslag: quiz-eksperten

En mulig [`.agents/skills/quiz-expert/SKILL.md`](../../.agents/skills/quiz-expert/SKILL.md) for seedede spørsmål er:

```markdown
---
name: quiz-expert
description: Seedede quizspørsmål i denne quiz-applikasjonen. Bruk BARE når du skal legge til spørsmål som skal finnes når applikasjonen starter.
---

# Quiz-ekspert

Bruk denne rekkefølgen når du skal legge til eller endre et seedet quizspørsmål:

1. Les `backend/src/main/resources/db/migration/V1__init_schema_and_seed.sql` for seeddata og tabellstrukturen.
2. Les `openapi/quiz-api.yaml` og `backend/src/main/kotlin/no/effektiv/quiz/service/QuestionService.kt` for felter og valideringsregler: ett spørsmål, nøyaktig fire alternativer, fire posisjoner fra 0 til 3 og nøyaktig ett riktig alternativ.
3. Se `backend/src/main/kotlin/no/effektiv/quiz/repository/ExposedQuestionRepository.kt` for hvordan seedradene mappes til domenemodellen.
4. Endre aldri en allerede anvendt Flyway-migrering. Bruk en ny versjonert migrering for en eksisterende database, og oppdater bare startmigreringa når det faktisk gjelder en ny database.
5. Kjør `./backend/gradlew -p backend test --tests no.effektiv.quiz.QuizApiIntegrationTest` for å verifisere migrering og oppstart. Kjør full testpakke når endringa tilsier det.

Ikke bruk denne skillen for spørsmål som legges til gjennom UI-et eller API-et. Ikke endre generert klient, BFF eller grensesnitt når oppgaven bare gjelder seeddata.
```

Legg merke til at skillen er avgrenset til seedede spørsmål. Den peker til migreringa, sannhetskildene og en trygg arbeidsrekkefølge uten å duplisere kildekode.

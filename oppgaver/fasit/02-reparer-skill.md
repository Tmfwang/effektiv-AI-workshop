# Løsningsforslag: quiz-eksperten

En mulig [`.agents/skills/quiz-expert/SKILL.md`](../../.agents/skills/quiz-expert/SKILL.md) er:

```markdown
---
name: quiz-expert
description: Opprette quizspørsmål i denne quiz-applikasjonen. Bruk når du skal legge til et spørsmål eller implementere en endring i flyten mellom OpenAPI-kontrakten, Ktor-backend, Next.js BFF og grensesnittet.
---

# Quiz-ekspert

Bruk denne rekkefølgen når du skal opprette et quizspørsmål:

1. Les `openapi/quiz-api.yaml` som sannhetskilden for API-kontrakten og valideringsreglene for et nytt spørsmål.
2. Følg dataflyten i backend fra `backend/src/main/kotlin/no/effektiv/quiz/api/Routes.kt`, via `QuestionService`, til `QuestionRepository` og den konkrete implementasjonen. Kontroller validering, ID-håndtering og feilsvar.
3. Undersøk BFF-handlerne under `frontend/app/api/` og klienten som brukes der. Ikke rediger genererte klientfiler manuelt; regenerer dem fra OpenAPI-kontrakten hvis kontrakten endres.
4. Undersøk `frontend/src/components/quiz-app.tsx` og relevante dialoger eller komponenter for hvordan brukeren skal opprette et spørsmål.
5. Kjør fokuserte tester for opprettelsesflyten. Kjør deretter `./backend/gradlew -p backend test` og relevante frontend-sjekker.

Hold kontrakt, backend, BFF, generert klient og grensesnitt i samsvar. Ikke endre urelatert quizlogikk eller grensesnitt.
```

Legg merke til at skillen er avgrenset til opprettelse av quizspørsmål. Den peker til sannhetskilder og en arbeidsrekkefølge uten å duplisere kildekode.

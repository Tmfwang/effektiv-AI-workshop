# Løsningsforslag: quiz-eksperten

En mulig [`.agents/skills/quiz-expert/SKILL.md`](../../.agents/skills/quiz-expert/SKILL.md):

```markdown
---
name: quiz-expert
description: Quizflyt, livsløpet til spørsmål, Ktor-ruter, Next.js BFF og OpenAPI-relasjoner. Bruk når du skal spore eller forklare hvordan eksisterende quizdata beveger seg gjennom StackCheck, ikke når du skal implementere en ny API-endring.
---

# Quizekspert

Spor den eksisterende forespørselen gjennom disse kildene i rekkefølge:

1. Les `openapi/quiz-api.yaml` som sannhetskilden for kontrakten.
2. Undersøk `backend/src/main/kotlin/no/effektiv/quiz/api/Routes.kt` og tjenesten/repositoriet den kaller.
3. Undersøk bruken av den genererte klienten uten å redigere genererte filer.
4. Undersøk BFF-handlerne under `frontend/app/api/` og hvordan de bruker den genererte klienten.
5. Kjør fokuserte tester, deretter `./backend/gradlew -p backend test` eller relevante frontendsjekker.

Ikke rediger filer mens du sporer flyten. Ikke implementer API-endringer eller endre urelatert quizgrensesnitt.
```

Legg merke til at skillen peker til sannhetskilder og en arbeidsrekkefølge. Den dupliserer ikke kildekode eller hele prosjektbeskrivelsen.

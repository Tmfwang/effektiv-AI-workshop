# Løsningsforslag: `AGENTS.md`

Dette er ett mulig minimum:

```markdown
Behandle `openapi/quiz-api.yaml` som sannhetskilden for API-et.
Rediger aldri filer under `frontend/src/generated/`; generer dem på nytt.
Bruk Gradle-wrapperen for backendkommandoer og Volta med pnpm for frontendkommandoer.
Kjør fokuserte tester for endret kode før bredere sjekker.
Ikke les eller eksponer hemmeligheter fra `.env`.
```

Poenget er ikke akkurat disse formuleringene. Reglene er korte, gjelder nesten alle oppgaver og hindrer sannsynlige feil. Detaljer om mapper og kommandoer finnes allerede i [`README.md`](../../README.md) og kan leses ved behov.

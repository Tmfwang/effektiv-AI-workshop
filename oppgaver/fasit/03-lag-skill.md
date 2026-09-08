# Løsningsforslag: skill for å kjøre appen

Her er én mulig løsning for `run-app` i `.agents/skills/run-app/SKILL.md`:

```markdown
---
name: run-app
description: Start appen, kjør appen lokalt, eller åpne quizen. Bruk når backend og frontend skal startes for lokal utvikling.
---

# Kjør appen lokalt

1. Les oppstartsseksjonen i `README.md` og sjekk at `.env` finnes i roten.
2. Start Ktor fra `backend/` med `./gradlew run` i en egen prosess.
3. Installer frontend-avhengigheter og generer API-klienten som beskrevet i `README.md` dersom det ikke allerede er gjort.
4. Start Next.js fra `frontend/` med `volta run pnpm dev` i en egen prosess.
5. Kontroller at quizen svarer på `http://localhost:3000`, og rapporter URL-ene og eventuelle oppstartsfeil.

Ikke slett `backend/data/quiz.db`, endre kildekode eller start test- og produksjonsbygg med mindre brukeren ber om det. Ikke start en ny kopi av en tjeneste som allerede kjører.
```

Mulige testmeldinger:

```text
Kjør appen lokalt så jeg kan prøve quizen.
```

```text
Kjør backend-testene.
```

Den første bør aktivere skillen. Den andre bør ikke gjøre det.

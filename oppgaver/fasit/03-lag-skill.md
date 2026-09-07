# Løsningsforslag: ny skill

Her er én mulig løsning for `database-change` i `.agents/skills/database-change/SKILL.md`:

```markdown
---
name: database-change
description: Flyway-migrering, SQLite-skjema, tabell, kolonne, indeks eller seeddata. Bruk BARE når du skal planlegge eller implementere en varig databaseendring.
---

# Trygg databaseendring

1. Undersøk eksisterende filer under `backend/src/main/resources/db/migration/`.
2. Legg til en ny versjonert migrering; skriv aldri om en anvendt migrering.
3. Oppdater Exposed-repositoriet og domenemodellen bare der skjemaet krever det.
4. Legg til en migrerings- eller repositorytest med en midlertidig SQLite-database.
5. Kjør `./backend/gradlew -p backend test`.

Endre aldri en eksisterende Flyway-migrering. Ikke slett den lokale databasen med mindre brukeren eksplisitt ber om å nullstille utviklingsdata.
```

Mulige testmeldinger:

```text
Legg til en difficulty-kolonne for spørsmål i databasen.
```

```text
Endre fargen på knappen for å starte quizen.
```

Den første bør aktivere skillen. Den andre bør ikke gjøre det.

# Effektiv AI-workshop

Dette repoet inneholder en praktisk workshop om effektivt oppsett og bruk av AI-agenter i en applikasjon. Velg oppgavesettet som passer verktøyet du bruker:

- [Workshop med OpenCode](oppgaver-opencode/README.md)
- [Workshop med Claude Code](oppgaver-claude/README.md)
- [Oppsett og dokumentasjon for quiz-applikasjonen](APPLICATION.md)

OpenCode- og Claude Code-løypene dekker de samme temaene, men bruker separate oppsett og verktøyspesifikke instrukser.

<br/>

---

## Før workshoppen

Velg verktøyet du skal bruke og gjør oppsettet ferdig før du starter på workshoppen.

### Claude Code

Installer Claude Code:

```bash
brew install --cask claude-code
```

Start Claude Code fra et nytt terminalvindu:

```bash
claude
```

Skriv `/login` i visningen som åpnes, og følg instruksjonene for å logge inn med kontoen eller abonnementet du skal bruke.

### OpenCode

Installer OpenCode:

```bash
brew install anomalyco/tap/opencode
```

Logg inn med AI-leverandøren du skal bruke:

```bash
opencode auth login
```

Følg instruksjonene i terminalen.

### Felles krav

Installer Volta, åpne et nytt terminalvindu og installer Node.js 22:

```bash
curl https://get.volta.sh | bash
volta install node@22.22.2
```

Sørg også for at du har nettleseren Google Chrome installert.

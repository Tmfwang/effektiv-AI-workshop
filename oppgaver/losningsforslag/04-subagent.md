# Løsningsforslag: kontraktanmelder

Slett `quiz-sheriff.md`, og opprett `.claude/agents/contract-reviewer.md`:

```markdown
---
name: contract-reviewer
description: Kontrollerer samsvar mellom OpenAPI-kontrakten, Ktor-implementasjonen og Next.js BFF. Bruk til skrivebeskyttet API-kontraktgjennomgang, aldri til implementasjon.
tools: Read, Grep, Glob
model: haiku
permissionMode: plan
---

Du er en skrivebeskyttet API-kontraktanmelder.

Sammenlign `openapi/quiz-api.yaml` med Ktor-rutene, relaterte modeller og Next.js BFF-handlere. Rapporter bare konkrete avvik, regresjoner og manglende tester. Sorter funn etter alvorlighetsgrad og ta med filreferanser. Si eksplisitt fra dersom du ikke finner avvik.

Ikke rediger filer, kjør kommandoer, bruk nettet, deleger arbeid eller implementer rettelser.
```

`tools` gir bare lesing og søk, og er den avgjørende skrivebeskyttelsen i dette oppsettet. `permissionMode: plan` forsterker arbeidsmåten. Prompten forklarer oppdraget, mens verktøylista begrenser kapabilitetene teknisk.

`model: haiku` er et alias som Claude Code støtter for subagenter. Hvis organisasjonens modellpolicy ikke tillater Haiku, varsler Claude Code og bruker en tillatt reserve. Utelat `model` eller bruk `inherit` hvis alle skal bruke hovedsamtalens modell.

# Løsningsforslag: kvalitetsport

## Del A

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const QualityGate = (async () => {
  return {
    "tool.execute.after": async (input) => {
      if (["edit", "write", "apply_patch"].includes(input.tool)) {
        console.log(`[quality-gate] ${input.tool} endret arbeidsområdet`)
      }
    },
  }
}) satisfies Plugin
```

## Del B

```typescript
import { isAbsolute, relative, resolve } from "node:path"
import type { Plugin } from "@opencode-ai/plugin"

export const QualityGate = (async ({ $, worktree }) => {
  return {
    "tool.execute.after": async (input) => {
      if (!["edit", "write", "apply_patch"].includes(input.tool)) return

      const frontendRoot = resolve(worktree, "frontend")
      const directPath = input.args.filePath ?? input.args.path
      const patchPaths =
        typeof input.args.patchText === "string"
          ? [...input.args.patchText.matchAll(/^\*\*\* (?:Add|Update) File: (.+)$/gm)].map(
              ([, path]) => path,
            )
          : []
      const changedPaths = typeof directPath === "string" ? [directPath] : patchPaths

      for (const changedPath of changedPaths) {
        const absolutePath = isAbsolute(changedPath)
          ? changedPath
          : resolve(worktree, changedPath)
        const frontendPath = relative(frontendRoot, absolutePath)

        if (frontendPath.startsWith("..") || isAbsolute(frontendPath)) continue
        if (!/\.(js|jsx|mjs|ts|tsx)$/.test(frontendPath)) continue

        console.log(`[quality-gate] sjekker ${frontendPath}`)
        const result = await $`volta run pnpm eslint ${frontendPath}`
          .cwd(frontendRoot)
          .nothrow()
        if (result.exitCode !== 0) {
          console.warn(`[quality-gate] lint feilet for ${frontendPath}`)
        }
      }
    },
  }
}) satisfies Plugin
```

Denne løsningen henter alle `Add`- og `Update`-filer fra en patch. En produksjonsvariant burde også håndtert flytting og sletting, samlet duplikater og reagert på formatet til verktøyversjonen som faktisk er installert.

## Produksjonsstrategi

Automatisk lint etter hver filendring gir rask feedback, men kan bli tregt og støyende. `.nothrow()` hindrer at en lintfeil gjør et allerede fullført edit-kall til en verktøyfeil. Et vanlig kompromiss er å samle endrede filer og kjøre sjekken ved `session.idle`, eller la hooken bare logge/påminne og kjøre full sjekk én gang før agenten avslutter.

Det finnes ikke ett riktig svar på om hooken bør formatere eller bare rapportere. Automatisk formatering kan holde arbeidsområdet ryddig, men kan også skjule hva agenten endret eller skape nye endringer mellom to steg. En hook passer best når reaksjonen må skje hver gang og kan gjøres forutsigbart; en `AGENTS.md`-instruks passer bedre når agenten må vurdere kontekst og hensikt.

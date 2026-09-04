import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Next.js environment preloader", () => {
  it("loads the repository .env before starting Next.js", () => {
    const repositoryDirectory = mkdtempSync(path.join(os.tmpdir(), "quiz-next-env-"));
    const frontendDirectory = path.join(repositoryDirectory, "frontend");
    const loaderPath = path.resolve(process.cwd(), "scripts/load-root-env.mjs");
    const key = "QUIZ_NEXT_ROOT_ENV_TEST";
    const environment = { ...process.env };
    delete environment[key];

    mkdirSync(frontendDirectory);
    writeFileSync(path.join(repositoryDirectory, ".env"), `${key}=from-env\n`);

    try {
      const result = spawnSync(
        process.execPath,
        ["--import", loaderPath, "-e", `process.stdout.write(process.env.${key} ?? "")`],
        { cwd: frontendDirectory, env: environment, encoding: "utf8" },
      );

      expect(result.status).toBe(0);
      expect(result.stdout).toBe("from-env");
    } finally {
      rmSync(repositoryDirectory, { recursive: true, force: true });
    }
  });
});

import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../openapi/quiz-api.yaml",
  output: {
    path: "src/generated",
    clean: true,
  },
  plugins: ["@hey-api/typescript", "@hey-api/client-fetch", "@hey-api/sdk"],
});

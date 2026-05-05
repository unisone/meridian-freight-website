import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    // Default environment is "node" for fast pure-function tests. Component
    // tests opt into jsdom via `// @vitest-environment jsdom` at the top of
    // each .tsx test file (Vitest 4 removed environmentMatchGlobs).
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});

import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Vitest configuration for the admin smoke tests.
 *
 * @remarks
 * Runs in a `jsdom` environment with globals enabled, loads `./tests/setup.ts`
 * before the suite, only picks up `*.smoke.test.tsx` files, transforms JSX
 * with the automatic React runtime, and resolves the `@` alias to the admin
 * package root.
 */
export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    include: ["**/*.smoke.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});

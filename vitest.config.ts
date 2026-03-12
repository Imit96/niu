import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // next/cache and next/server don't run outside the Next.js runtime;
      // redirect them to lightweight mocks for the test environment.
      "next/cache": path.resolve(__dirname, "./src/__tests__/__mocks__/next-cache.ts"),
      "next/server": path.resolve(__dirname, "./node_modules/next/dist/server/web/exports/index.js"),
    },
  },
});

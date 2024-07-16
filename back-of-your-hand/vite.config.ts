import { sveltekit } from "@sveltejs/kit/vite";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    target: browserslistToEsbuild(),
  },
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});

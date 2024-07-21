import browserslistToEsbuild from "browserslist-to-esbuild";
// @ts-expect-error no types available
import getCommitId from "git-commit-id";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: browserslistToEsbuild(),
  },
  define: {
    COMMIT_ID: JSON.stringify(getCommitId({ cwd: ".." }) || "unknown"),
  },
  plugins: [
    svelte({
      onwarn: (warning, handler) => {
        if (!handler || warning.code === "css-unused-selector") {
          return;
        }
        handler(warning);
      },
    }),
  ],
});

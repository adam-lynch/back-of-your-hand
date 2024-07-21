import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: browserslistToEsbuild(),
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

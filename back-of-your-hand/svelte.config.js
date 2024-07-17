import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  onwarn: (warning, handler) => {
    if (warning.code === "css-unused-selector") {
      return;
    }
    handler(warning);
  },

  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      assets: "build/svelte-build-output",
      fallback: "app.html",
      pages: "build/svelte-build-output",
      precompress: true,
      strict: true,
    }),
  },
};

export default config;

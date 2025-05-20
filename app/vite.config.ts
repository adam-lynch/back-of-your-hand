/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { preprocess as delegateAllEvents } from "svelte-preprocess-delegate-events";
// @ts-expect-error no types available
import getCommitId from "git-commit-id";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../dist",
    sourcemap: true,
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
      preprocess: [sveltePreprocess({ typescript: true }), delegateAllEvents()],
    }),
    Icons({
      compiler: "svelte",
    }),
  ],
  server: {
    https: {
      cert: process.env.BOYH_HTTPS_CERT,
      key: process.env.BOYH_HTTPS_KEY,
    },
  },
});

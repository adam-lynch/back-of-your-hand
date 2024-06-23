import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import resolve from "@rollup/plugin-node-resolve";
import sveltePreprocess from "svelte-preprocess";
import replace from "@rollup/plugin-replace";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import autoprefixer from "autoprefixer";
import fs from "fs";
import getCommitId from "git-commit-id";
const { visualizer } = require("rollup-plugin-visualizer");

const production = !process.env.ROLLUP_WATCH;
const shouldOutputSourceMaps = true;
let httpsDetails = null;
if (process.env.BOYH_HTTPS_CERT && process.env.BOYH_HTTPS_KEY) {
  httpsDetails = {
    cert: process.env.BOYH_HTTPS_CERT,
    key: process.env.BOYH_HTTPS_KEY,
  };
}

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;

      let startCommand = "npm run start -- --dev";
      if (httpsDetails) {
        startCommand += ` --cert "${httpsDetails.cert}" --http2 --key "${httpsDetails.key}"`;
      }

      const startCommandPieces = startCommand.split(" ");

      server = require("child_process").spawn(
        startCommandPieces[0],
        startCommandPieces.slice(1),
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

const livereloadConfig = {
  watch: "public",
};
if (httpsDetails) {
  livereloadConfig.https = {
    cert: fs.readFileSync(httpsDetails.cert),
    key: fs.readFileSync(httpsDetails.key),
  };
}

export default {
  input: "source/index.ts",
  output: {
    sourcemap: shouldOutputSourceMaps,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("bundle.css");
      },
      preprocess: sveltePreprocess({
        babel: true,
        postcss: {
          plugins: [autoprefixer()],
        },
        sourceMap: shouldOutputSourceMaps,
      }),
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: shouldOutputSourceMaps,
      inlineSources: shouldOutputSourceMaps,
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload(livereloadConfig),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    replace({
      COMMIT_ID: `"${getCommitId() || "unknown"}"`,
      isProduction: production,
    }),

    production && visualizer(),
  ],
  watch: {
    clearScreen: false,
  },
};

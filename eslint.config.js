import globals from "globals";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // TODO: remove?
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    ignores: ["dist", "public/gc.js", "src/lib/third-party"],
  },
];

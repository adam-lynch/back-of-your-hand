# Contributing

Read the root [CONTRIBUTING.md](../CONTRIBUTING.md) before continuing here.

# Set up the project

Prerequisites: [Node.js](https://nodejs.org).

1. Run `npm install` in this directory.

# Development

1. Run `npm run dev`.

This recompiles and live-reloads the app as you make changes.

## HTTPS

To set up HTTPS, set these environment variables:

- `BOYH_HTTPS_CERT`
- `BOYH_HTTPS_KEY`

Both should be absolute paths to files. They will be [passed to Vite](https://vitejs.dev/config/server-options.html#server-https).

## TypeScript

This project uses TypeScript, but the actual amount of it used is very little. This is my first Svelte project but it seems like the TypeScript integration isn't very deep. So TypeScript is mostly used for:

- Documenting some types like what the "round" model is, but not necessarily enforcing it anywhere.
- Between the Overpass API and multiple libraries, there are multiple representations for coordinates, and we convert between them in a few places. So, type annotations are useful whenever coordinates / LatLngs are passed around.

### Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

## VSCode

If you're using [Visual Studio Code](https://code.visualstudio.com/) I recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

Also, add this to your workspace-level settings:

```
"svelte.plugin.svelte.compilerWarnings": {
  "css-unused-selector": "ignore",
}
```

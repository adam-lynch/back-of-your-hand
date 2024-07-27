Contributions are more than welcome! It's probably worth reading why and how I made this; [Introducing Back Of Your Hand](https://adamlynch.com/back-of-your-hand).

# Exclusions

If you'd like to exclude a certain street name from being selected (e.g. "alley"), you can edit [`source/utilities/exclusions.ts`](./source/utilities/exclusions.ts).

# Set up the project

Prerequisites: [Node.js](https://nodejs.org).

1. Run `npm install` at the root of the project.

If you're using [Visual Studio Code](https://code.visualstudio.com/) I recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

# Development

1. Run `npm run dev`.

This recompiles and live-reloads the app as you make changes.

Warning: I think this might be slightly broken since I introduced Babel. At least for me, it sometimes requires a manual reload.

## HTTPS

To set up HTTPS, set these environment variables:

- `BOYH_HTTPS_CERT`
- `BOYH_HTTPS_KEY`

Both should be absolute paths to files. They will be [passed to Vite](https://vitejs.dev/config/server-options.html#server-https).

## Edge handlers

To run the [edge handlers](./functions) in dev mode, additionally run `npx wrangler pages dev public --port 8788`.

## TypeScript

This project uses TypeScript, but the actual amount of it used is very little. This is my first Svelte project but it seems like the TypeScript integration isn't very deep. So TypeScript is mostly used for:

- Documenting some types like what the "round" model is, but not necessarily enforcing it anywhere.
- Between the Overpass API and multiple libraries, there are multiple representations for coordinates, and we convert between them in a few places. So, type annotations are useful whenever coordinates / LatLngs are passed around.

# Deploying to production

This automatically happens when a pull-request is merged / a commit is pushed to the main branch.

## VSCode

Add this to your workspace-level settings:

```
"svelte.plugin.svelte.compilerWarnings": {
  "css-unused-selector": "ignore",
}
```

# TODO: keep or not?

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

# License header

A license header comment will automatically be added to the top of any new files you create (by a git hook).

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

Both should be absolute paths to files. They will be passed to [sirv-cli](https://github.com/lukeed/sirv/tree/master/packages/sirv-cli) (see `--cert` and `--key`).

## Edge handlers

To run the [edge handlers](./functions) in dev mode, additionally run `npx wrangler pages dev public --port 8788`.

## TypeScript

This project uses TypeScript, but the actual amount of it used is very little. This is my first Svelte project but it seems like the TypeScript integration isn't very deep. So TypeScript is mostly used for:

- Documenting some types like what the "round" model is, but not necessarily enforcing it anywhere.
- Between the Overpass API and multiple libraries, there are multiple representations for coordinates, and we convert between them in a few places. So, type annotations are useful whenever coordinates / LatLngs are passed around.

# Deploying to production

This automatically happens when a pull-request is merged / a commit is pushed to the main branch.

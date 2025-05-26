# Contributing

Contributions are more than welcome! It's probably worth reading why and how I made this; [Introducing Back Of Your Hand](https://adamlynch.com/back-of-your-hand).

## Exclusions

If you'd like to exclude a certain street name from being selected (e.g. "alley"), you can edit [`app/source/utilities/exclusions.ts`](./app/source/utilities/exclusions.ts).

## Set up project

1. Run `npm install` at the root of the project.

## Development

This file contains project-level information. You probably also want to check out:

- [`app/README.md`](./app/README.md)

### Edge handlers

To run the [edge handlers](./functions) in dev mode, additionally run `npx wrangler pages dev public --port 8788`.

### License header

A license header comment will automatically be added to the top of any new files you create (by a git hook).

## Deploying to production

This automatically happens when a pull-request is merged / a commit is pushed to the main branch.

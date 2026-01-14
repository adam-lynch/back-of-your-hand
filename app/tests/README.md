# Tests

Unit tests live in this folder and mirror the `app/source` structure so it scales.
For example, `app/source/utilities/capNumber.ts` is covered by
`app/tests/utilities/capNumber.test.ts`.

## Running tests

- `npm run vitest` (single run)
- `npm run vitest--watch` (watch mode)
- `npm test` (alias for `npm run vitest`)

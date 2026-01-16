# Playwright tests

## Setup

1. Run `npx playwright install` when you need to install browsers locally.
2. Make sure HTTPS is set up. See [/app/README.md](../../README.md).

## Running tests

- `npm run playwright` (single run)
- `npm run playwright--watch` (UI mode)

## File structure

- Name files with the `.test.ts` suffix.

## Helpers and fixtures

- Place shared helpers under `tests/playwright/helpers`.
- Place fixtures under `tests/playwright/fixtures`.

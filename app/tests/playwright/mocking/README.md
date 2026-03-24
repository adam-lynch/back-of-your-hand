# Playwright Mock System

This directory contains the per-test isolation mock system for E2E tests.

## How It Works

The mock system uses Playwright's native `page.route()` to intercept HTTP requests and fulfill them with recorded responses. This approach works with any HTTP endpoint: backend APIs, external services (Overpass API), map tiles, etc.

**Per-test isolation**: Each test file gets its own mock file with responses organized by describe blocks and test names. This enables:

- Complete test isolation
- Handling multiple requests to the same endpoint (tracked by per-endpoint counters)
- Re-recording individual tests without affecting others
- Smaller, more manageable mock files

## Structure

```
mocking/
├── setup.ts                # Test fixture that loads and applies per-test mocks
├── ...
└── mocks/
    ├── shared-bodies/      # Large response bodies stored once, referenced by hash
    │   ├── {sha256}.json
    │   └── ...
    ├── public/             # Mirrors tests/playwright/public/ structure
    │   ├── homepage.mock.ts
    │   └── ...
    └── organizations/      # Mirrors tests/playwright/organizations/ structure
        ├── authentication.mock.ts
        └── ...
```

## Mock Format

Mock files use the `.mock.ts` extension (e.g. `invite-acceptance.mock.ts` for `invite-acceptance.test.ts`). They contain a nested structure mirroring the test hierarchy:

```typescript
const mocks = {
  "Authentication": {  // describe block
    "can log in as admin": {  // test name
      "GET example1--backend.local-backofyourhand--backend.com:7200/api/users/me": {
        0: {  // First request to this endpoint
          body: { data: { type: "user", id: "123", attributes: {...} } }
        },
        1: {  // Second request to same endpoint
          // ...
        }
      }
    }
  }
};
```

The endpoint key format is: `"{METHOD} {host}{pathname}{search}{hash}"` (full URL without protocol).

Each response entry contains:

- `body` (required) — the response body, or a `"__shared_body::{sha256}"` reference for large bodies (see below)
- `status` (optional) — omitted when 200
- `headers` (optional) — only stored when non-default headers are needed (e.g. `set-cookie`). Content-type is inferred from the URL domain: `application/vnd.api+json` for backend, `application/json` for everything else.

### Shared bodies

Response bodies larger than 1KB are extracted into `mocks/shared-bodies/{sha256}.json` and referenced by hash. This avoids duplicating large geometry data across tests. The same body used by multiple tests (or multiple requests within a test) is stored exactly once.

A pre-commit hook automatically prunes orphaned shared body files when mock files change.

## Usage

Tests automatically use mocks when `PLAYWRIGHT_BACKEND=mock` (default). The setup.ts fixture:

1. Derives the mock file path from the test file path
2. Traverses the nested structure using `testInfo.titlePath` to find the test's mocks
3. Tracks per-endpoint counters during playback to serve the correct response

## Recording Mocks

See the main [README.md](../README.md#mock-recording) for detailed recording workflows.

Quick reference:

```bash
# Record all tests
npm run playwright:record-mocks:public
npm run playwright:record-mocks:organizations

# Record specific test file
PLAYWRIGHT_BACKEND=local PLAYWRIGHT_SHOULD_RECORD_MOCKS=true npx playwright test user-settings
```

**Important:** Always reset the backend before recording to ensure clean seed data:

```bash
cd ../back-of-your-hand--backend
(rm compose/local/django/__initial_setup_done || echo ".") && docker-compose down -v && docker-compose up --build -d
cd ../back-of-your-hand--frontend/app
```

## Common Patterns

### Adding a test for a new feature

1. Write the test
2. Run it in recording mode against local backend
3. A new mock file (or updated existing file) is automatically generated
4. Commit the mock file with your test

### Updating mocks after API changes

1. Delete the entire mock file (or specific test's section)
2. Run recording mode
3. Review changes with `git diff tests/playwright/mocking/mocks/`
4. Commit updated mocks

### Token expiration handling

Mock responses contain JWT access tokens with short-lived `accessExpiration` timestamps (30 minutes from recording time). Without intervention, the frontend would detect these as expired and attempt a `POST /auth/token/refresh/` that has no mock, crashing the app.

The mock playback in `setup.ts` patches `accessExpiration` in any response body to 1 hour in the future, preventing token refresh attempts entirely. This means mocks work regardless of when they were recorded.

### Multi-page tests (e.g. multiplayer)

The default `page` fixture has mocks applied automatically. Tests that create additional pages in separate browser contexts (e.g. a "friend" joining a multiplayer session) must apply mocks to those pages manually via the `applyMocksToPage` fixture:

```typescript
test("multiplayer test", async ({ page, applyMocksToPage }) => {
  // ... create a new browser context and page ...
  const friendPage = await friendContext.newPage();
  await applyMocksToPage(friendPage);
  // friendPage now shares mock state (counters) with the leader page
});
```

All pages share the same per-endpoint counters, so mock indices are consumed in request order across all pages. During recording, requests from all pages are captured into the same mock file.

### Debugging mock issues

If a test can't find its mocks:

- Check that the mock file exists at the expected path (mirrors test file path)
- Check that the test name in titlePath matches the structure in the mock file
- Check console output for "⚠️ No mocks found for test path" messages

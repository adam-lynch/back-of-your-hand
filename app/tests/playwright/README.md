# Playwright E2E Tests

End-to-end tests for Back Of Your Hand using Playwright.

## Setup

1. Run `npx playwright install` when you need to install browsers locally.
2. Make sure HTTPS is set up. See [/app/README.md](../../README.md).

## Running Tests

Tests run **headlessly** by default. To use interactive UI mode, append `-- --ui` to any command:

```bash
npm run playwright:local -- --ui
```

### All Tests

```bash
npm run playwright              # Run all tests with mocks (default)
```

### Public Version Tests

```bash
npm run playwright:public              # With mocks (default)
npm run playwright:local:public        # Against local backend
npm run playwright:record-mocks:public # Record mocks from local backend
```

### Organization Version Tests

```bash
npm run playwright:organizations              # With mocks (default)
npm run playwright:local:organizations        # Against local backend
npm run playwright:record-mocks:organizations # Record mocks from local backend
```

## Test Modes

- **Mock mode** (default): Tests run against mocked API responses. No backend needed. Uses all CPU cores.
- **Local mode**: Tests run against local backend. Requires Docker running. Sequential (`workers: 1`).
- **Production mode**: Runs public tests only against `https://backofyourhand.com`. Organization tests are excluded.
- **Recording mode**: Captures real API responses and writes per-test mock files. Uses local backend.

Set mode via environment variables:

- `PLAYWRIGHT_BACKEND=mock|local|production` (default: `mock`)
- `PLAYWRIGHT_SHOULD_RECORD_MOCKS=true|false` (default: `false`)

> **Note:** Mock mode works for everyone. Local mode and recording mocks require access to the private backend repository.

## Directory Structure

```
tests/playwright/
├── public/          # Public version tests (no auth required)
├── organizations/   # Organization version tests (requires auth)
├── mocking/         # Mock recorder + per-test mock files
├── fixtures/        # Test data and fixtures
├── helpers/         # Shared test utilities
└── test-results/    # Playwright output (gitignored)
```

## True End-to-End Testing

- Tests should exercise the full user journey through the UI
- Avoid using APIs unless you absolutely have to
- Avoid API shortcuts for user-facing features. Examples:
  - ❌ Don't create invites via API - use the invite modal UI
  - ❌ Don't delete users via API - use the settings page UI
  - ✅ Do use UI actions to create and delete users

## Mock Recording

### How It Works

The mock system uses Playwright's `page.route()` to intercept HTTP requests. Mocks are stored as **per-test TypeScript files** in `mocking/mocks/`, mirroring the test file structure:

- `tests/playwright/public/homepage.test.ts` → `mocking/mocks/public/homepage.ts`
- `tests/playwright/organizations/authentication.test.ts` → `mocking/mocks/organizations/authentication.ts`

When recording, the system:

1. Intercepts all HTTP requests (backend API, Overpass API, map tiles, etc.)
2. Fetches real responses and stores them in a nested structure organized by test describe blocks and test names
3. Tracks per-endpoint request counters to handle multiple requests to the same endpoint

**Per-test isolation benefits:**

- Each test has independent mocks
- Adding a request to endpoint A doesn't shift indices for endpoint B
- Can re-record specific tests without affecting others
- Smaller, more manageable mock files

**Important:** All responses are recorded regardless of HTTP status code (200s, 400s, 500s, etc.). This includes error responses, which is useful for testing error handling. Responses are also recorded even if the test fails.

### Recording Workflows

#### Reset and re-record all mocks

```bash
# Delete existing mock files
rm -rf tests/playwright/mocking/mocks/public/*.ts
rm -rf tests/playwright/mocking/mocks/organizations/*.ts

# Reset backend using internal instructions (not documented here)

# Record fresh
npm run playwright:record-mocks:public
npm run playwright:record-mocks:organizations
```

#### Re-record mocks for specific test file

```bash
# Reset backend using internal instructions (not documented here)

# Run recording mode with test filter
PLAYWRIGHT_BACKEND=local PLAYWRIGHT_SHOULD_RECORD_MOCKS=true npx playwright test user-settings
```

This generates/updates the mock file for only the matching test file.

Add `--headed` to see the browser window during test execution (useful for debugging).

#### Review changes

```bash
git diff tests/playwright/mocking/mocks/
```

### When to Use Mock Mode vs Local Backend

#### Use mock mode when

- Running tests in CI
- You want fast, reliable tests
- You don't need to test backend integration
- You're working on frontend changes only
- No backend Docker containers needed — only the frontend dev server (auto-started)

#### Use local backend mode when

- Testing backend integration (e.g., verifying data persists across requests)
- Developing new features that hit new API endpoints
- Debugging issues where mocks might not match reality
- Recording new mocks

#### Skipping tests in mock mode

If you really really need to, you can skip a test in mock mode like this:

```typescript
test("completed round appears in reports", async ({ page }) => {
  if (process.env.PLAYWRIGHT_BACKEND !== "local") {
    test.skip();
  }

  // Test implementation...
});
```

### Per-Test Mock Isolation

Mocks are **per-test**, stored under `tests/playwright/mocking/mocks/` with a 1:1 mapping to test files.
Each test has its own request counters per endpoint, so multiple responses to the same endpoint are handled automatically.

### When you need a different response in a single test

If a test needs a special response that doesn’t match the recorded data, you have two options:

1. **Re-record the test** to capture the desired response sequence.
2. **Override with `page.route()`** inside that specific test. The override only affects that test.

Example:

```typescript
test("shows error when user fetch fails", async ({ page }) => {
  await page.route("**/api/users/me", async (route) => {
    await route.fulfill({
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ errors: [{ detail: "Internal server error" }] }),
    });
  });

  await page.goto("/settings/profile");
  await expect(page.getByText(/error/i)).toBeVisible();
});
```

## Local Mode

Local mode (`PLAYWRIGHT_BACKEND=local`) runs tests against the local backend. This requires access to the private backend repository.

### Setup

1. Create `app/.env.local` with the path to your backend repo:

   ```
   BOYH_BACKEND_DIR=/path/to/back-of-your-hand--backend
   ```

2. Follow the setup instructions in the backend repo's docs (search for "Playwright local mode").

## File Naming

- Name test files with the `.test.ts` suffix
- Place tests in appropriate directories (public/ or organizations/)

## More Documentation

- [Mock System](./mocking/README.md)

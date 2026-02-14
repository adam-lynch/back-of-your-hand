# Using the API Recorder

The API recorder captures network requests during test execution and generates per-test mock files with complete test isolation.

## Basic Usage

The recorder is automatically set up for all tests. The test fixture in [setup.ts](../mocking/setup.ts) handles start/save automatically.

```typescript
import { expect, test } from "../mocking/setup";

test("example test", async ({ page }) => {
  // Recorder is automatically active when PLAYWRIGHT_SHOULD_RECORD_MOCKS=true
  await page.goto("/");
  // Mocks are automatically saved when test completes
});
```

## Per-Test Isolation

Each test file gets its own mock file:

- `tests/playwright/public/homepage.test.ts` → `mocking/mocks/public/homepage.ts`
- `tests/playwright/organizations/authentication.test.ts` → `mocking/mocks/organizations/authentication.ts`

Within each mock file, responses are organized by:

1. Describe blocks (test suites)
2. Test names
3. Endpoint (full URL without protocol)
4. Request index (0, 1, 2… for multiple requests to same endpoint)

This enables complete test isolation — each test has independent mocks and per-endpoint request counters.

## Recording Commands

```bash
# Reset backend first (required for clean seed data)
cd ../back-of-your-hand--backend
(rm compose/local/django/__initial_setup_done || echo ".") && docker-compose down -v && docker-compose up --build -d
cd ../back-of-your-hand--frontend/app

# Record all mocks
npm run playwright:record-mocks

# Record only public version mocks
npm run playwright:record-mocks:public

# Record only organization version mocks
npm run playwright:record-mocks:organizations

# Record specific test file
PLAYWRIGHT_BACKEND=local PLAYWRIGHT_SHOULD_RECORD_MOCKS=true playwright test path/to/test.ts
```

## What Gets Recorded

The recorder captures:

- All requests to `/api/**` endpoints
- All requests to `/auth/**` endpoints
- All requests to `/open/**` endpoints
- External API requests (Overpass API)
- Request method, full URL, headers
- Response status, headers, and body
- Per-endpoint request index (0, 1, 2…)

## Generated Files

Mock files are generated in `tests/playwright/mocking/mocks/` mirroring the test file structure:

```
mocking/mocks/
├── public/
│   ├── homepage.ts
│   ├── navigation.ts
│   └── ...
└── organizations/
    ├── authentication.ts
    ├── invitation.ts
    └── ...
```

Review changes with `git diff tests/playwright/mocking/mocks/` before committing.

## Example Mock Structure

```typescript
const mocks = {
  "Authentication": {  // describe block
    "can log in as admin": {  // test name
      "GET example1--backend.local-backofyourhand--backend.com:8000/api/users/me": {
        0: { method: "GET", url: "...", status: 200, headers: {...}, body: {...} },
        1: { method: "GET", url: "...", status: 200, headers: {...}, body: {...} }
      },
      "POST example1--backend.local-backofyourhand--backend.com:8000/auth/login": {
        0: { method: "POST", url: "...", status: 200, headers: {...}, body: {...} }
      }
    }
  }
};
```

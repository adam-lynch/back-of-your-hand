# Test Fixtures

This directory contains test data and fixtures for E2E tests.

## Purpose

Fixtures provide reusable test data for:

- User credentials (test accounts)
- API response data
- Test organization configurations
- Common test scenarios

## Usage

Create TypeScript files exporting test data:

```typescript
// test-users.ts
export const testUsers = {
  admin: {
    email: "paigecollins@example.com",
    password: "admin",
  },
  user1: {
    email: "testuser1@example.com",
    password: "testuser1",
  },
};
```

Import in tests:

```typescript
import { testUsers } from "../fixtures/test-users";

test("login as admin", async ({ page }) => {
  await page.fill('[name="email"]', testUsers.admin.email);
  await page.fill('[name="password"]', testUsers.admin.password);
});
```

## Backend Requirements

Test fixtures should match the data seeded in the backend during development. See the E2E testing specification for backend seeding requirements.

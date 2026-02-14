# Organization Version Tests

Tests for the organization version (requires authentication).

## Running Tests

```bash
# With mocks (default)
npm run playwright:organizations

# Against local backend
npm run playwright:local:organizations

# Record mocks from local backend
npm run playwright:record-mocks:organizations
```

## Test Users

Tests use credentials from `../fixtures/test-users.ts` which match the backend seeding:

- **Admin**: paigecollins@example.com / admin
- **Standard user**: testuser1@example.com / testuser1

## Prerequisites

For running against local backend:

1. Backend must be running with seeded data
2. Use subdomain: `example1.local-backofyourhand.com:5173`

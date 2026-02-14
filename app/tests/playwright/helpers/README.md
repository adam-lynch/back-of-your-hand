# Test Helpers

This directory contains helper utilities and documentation for E2E tests.

## Recording API Mocks

See [recording.md](./recording.md) for detailed instructions on using the API recorder to capture and generate MSW mock handlers.

## Example Tests

[recorder-test.example.ts](./recorder-test.example.ts) contains example tests demonstrating the recording workflow. These tests are skipped by default and serve as documentation.

## Quick Start: Recording Mocks

1. Ensure local backend is running
2. Run recording command:
   ```bash
   npm run playwright:record-mocks:public
   ```
3. Review generated handlers:
   ```bash
   git diff tests/playwright/mocks/handlers/
   ```
4. Commit if changes look correct

The recorder will automatically capture all API calls made during test execution and generate TypeScript MSW handler files.

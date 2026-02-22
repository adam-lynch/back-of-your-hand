/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { test as base } from "@playwright/test";
import type { Page, TestInfo } from "@playwright/test";
import isRecordableRequest from "./is-recordable-request";
import getMockFilePath from "./paths";
import { ApiRecorder } from "./recorder";

const backend = process.env.PLAYWRIGHT_BACKEND || "mock";
const shouldUseMocks = backend === "mock";
const shouldRecordMocks = process.env.PLAYWRIGHT_SHOULD_RECORD_MOCKS === "true";

interface MockState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testMocks: Record<string, any>;
  counters: Map<string, number>;
}

async function loadTestMocks(testInfo: TestInfo): Promise<MockState | null> {
  try {
    const mockFilePath = getMockFilePath(testInfo.file);
    const mocksModule = await import(mockFilePath);
    const allMocks = mocksModule.default || {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let testMocks: any = allMocks;
    const testPath = testInfo.titlePath.slice(1);
    for (const pathSegment of testPath) {
      testMocks = testMocks[pathSegment];
      if (!testMocks) {
        console.log(
          `⚠️  No mocks found for test path: ${testPath.join(" > ")}`,
        );
        return null;
      }
    }

    let totalMocks = 0;
    for (const endpointKey of Object.keys(testMocks)) {
      const endpointMocks = testMocks[endpointKey];
      if (typeof endpointMocks === "object") {
        totalMocks += Object.keys(endpointMocks).length;
      }
    }

    console.log(
      `✅ Loaded ${totalMocks} ${totalMocks === 1 ? "mock" : "mocks"} for ${testPath.map((piece) => `"${piece}"`).join(" > ")}`,
    );

    return { testMocks, counters: new Map() };
  } catch (error) {
    console.log(`⚠️  No mock file found, continuing without mocks: ${error}`);
    return null;
  }
}

async function applyMockRoutes(page: Page, state: MockState): Promise<void> {
  const { testMocks, counters } = state;

  await page.route("**/*", async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    const urlObj = new URL(url);
    const urlWithoutProtocol = `${urlObj.host}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
    const endpoint = `${method} ${urlWithoutProtocol}`;

    const currentCount = counters.get(endpoint) || 0;
    const endpointMocks = testMocks[endpoint];
    const mock = endpointMocks?.[currentCount];

    if (mock) {
      counters.set(endpoint, currentCount + 1);

      const contentType = mock.headers?.["content-type"] || "application/json";
      let body =
        typeof mock.body === "string" ? mock.body : JSON.stringify(mock.body);

      // Patch expired accessExpiration to prevent token refresh attempts
      if (body.includes('"accessExpiration"')) {
        const futureDate = new Date(Date.now() + 3600000).toISOString();
        body = body.replace(
          /"accessExpiration":"[^"]*"/,
          `"accessExpiration":"${futureDate}"`,
        );
      }

      await route.fulfill({
        status: mock.status || 200,
        body,
        headers: {
          "content-type": contentType,
          ...mock.headers,
        },
      });
    } else {
      if (isRecordableRequest(url)) {
        console.warn(`⚠️  No mock found for: ${endpoint}`);
        await route.abort("failed");
      } else {
        await route.continue();
      }
    }
  });
}

interface TestFixtures {
  page: Page;
  /*
   * Applies mock routes (and recording, if enabled) to a page. Automatically
   * applied to the default test `page`. Call manually on additional pages
   * created in separate browser contexts (e.g. a "friend" page in multiplayer
   * tests) so their API requests are also intercepted. All pages share the
   * same per-endpoint counters, so recorded mock indices stay in sync.
   */
  applyMocksToPage: (page: Page) => Promise<void>;
}

export const test = base.extend<TestFixtures>({
  // eslint-disable-next-line no-empty-pattern
  applyMocksToPage: async ({}, use, testInfo) => {
    let mockState: MockState | null = null;
    let recorder: ApiRecorder | null = null;

    if (shouldUseMocks) {
      mockState = await loadTestMocks(testInfo);
    }

    if (shouldRecordMocks) {
      recorder = new ApiRecorder(testInfo);
    }

    const isOrgTest = testInfo.file.includes("/organizations/");
    const subdomain = isOrgTest ? "example1" : undefined;

    const apply = async (page: Page) => {
      if (mockState) {
        await applyMockRoutes(page, mockState);
      }
      if (recorder) {
        await recorder.addPage(page, subdomain);
      }
    };

    await use(apply);

    if (recorder) {
      await recorder.save();
    }
  },

  page: async ({ page, applyMocksToPage }, use) => {
    await applyMocksToPage(page);
    await use(page);
  },
});

export { expect } from "@playwright/test";
export type { Page } from "@playwright/test";

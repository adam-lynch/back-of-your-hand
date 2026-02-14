/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import type { TestInfo } from "@playwright/test";
import getMockFilePath from "../mocking/paths";

/*
 * Returns the date that represents "today" for the test context.
 * In mock mode, this is the date the mocks were recorded (extracted from
 * HTTP response `date` headers). In local mode, it's the real current date.
 */
export default async function getTestDate(testInfo: TestInfo): Promise<Date> {
  const backend = process.env.PLAYWRIGHT_BACKEND || "mock";
  if (backend !== "mock") {
    return new Date();
  }

  const mockFilePath = getMockFilePath(testInfo.file);

  try {
    const mocksModule = await import(mockFilePath);
    const allMocks = mocksModule.default || {};
    const dateHeader = findDateHeader(allMocks);
    if (dateHeader) {
      return new Date(dateHeader);
    }
  } catch {
    // No mock file found
  }

  return new Date();
}

function findDateHeader(obj: unknown): string | null {
  if (!obj || typeof obj !== "object") return null;

  const record = obj as Record<string, unknown>;
  if (
    "headers" in record &&
    record.headers &&
    typeof record.headers === "object" &&
    "date" in (record.headers as Record<string, unknown>)
  ) {
    return (record.headers as Record<string, string>).date;
  }

  for (const value of Object.values(record)) {
    const found = findDateHeader(value);
    if (found) return found;
  }

  return null;
}

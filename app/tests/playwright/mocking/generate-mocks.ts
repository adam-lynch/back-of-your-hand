/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join, relative } from "path";
import type { TestInfo } from "@playwright/test";
import type { RecordedResponse } from "./types";

export async function generatePlaywrightMocks(
  responses: RecordedResponse[],
  testInfo: TestInfo,
): Promise<void> {
  if (responses.length === 0) {
    console.log("No responses to record");
    return;
  }

  // Derive mock file path from test file path
  const playwrightDir = join(process.cwd(), "tests", "playwright");
  const relativePath = relative(playwrightDir, testInfo.file);
  const mockFileName = relativePath.replace(/\.test\.ts$/, ".mock.ts");
  const mockFilePath = join(playwrightDir, "mocking", "mocks", mockFileName);

  let mocks: Record<string, unknown> = {};

  if (existsSync(mockFilePath)) {
    try {
      // Read as text to avoid Node's module cache
      const fileContent = readFileSync(mockFilePath, "utf-8");
      // Extract JSON from: const mocks = {...};
      const match = fileContent.match(
        /const mocks = ({[\s\S]*?});?\s*export default mocks;/,
      );
      if (match) {
        mocks = JSON.parse(match[1]);
      }
    } catch (error) {
      console.warn(`Failed to read existing mocks, starting fresh: ${error}`);
    }
  }

  for (const response of responses) {
    let current = mocks;
    for (const pathSegment of response.testPath) {
      if (!current[pathSegment]) {
        current[pathSegment] = {};
      }
      current = current[pathSegment];
    }

    if (!current[response.endpoint]) {
      current[response.endpoint] = {};
    }

    current[response.endpoint][response.index] = {
      method: response.method,
      url: response.url,
      status: response.status,
      headers: response.headers,
      body: response.body,
    };
  }

  const tsContent = `/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

const mocks = ${JSON.stringify(mocks, null, 2)};

export default mocks;
`;

  mkdirSync(dirname(mockFilePath), { recursive: true });
  writeFileSync(mockFilePath, tsContent, "utf-8");

  console.log(
    `✅ Generated mocks for ${testInfo.titlePath.join(" > ")} at ${mockFilePath}`,
  );
}

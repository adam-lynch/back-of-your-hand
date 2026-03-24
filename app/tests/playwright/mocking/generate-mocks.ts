/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { createHash } from "crypto";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join, relative } from "path";
import type { TestInfo } from "@playwright/test";
import type { RecordedResponse } from "./types";
import { getDefaultContentType } from "./content-type-defaults";

const HEADERS_TO_KEEP = new Set(["content-type", "set-cookie"]);
const SHARED_BODY_THRESHOLD = 1024;

function filterHeaders(
  headers: Record<string, string>,
  url: string,
): Record<string, string> | undefined {
  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (HEADERS_TO_KEEP.has(key)) {
      filtered[key] = value;
    }
  }

  if (Object.keys(filtered).length === 0) {
    return undefined;
  }

  if (
    Object.keys(filtered).length === 1 &&
    filtered["content-type"] &&
    filtered["content-type"] === getDefaultContentType(url)
  ) {
    return undefined;
  }

  return filtered;
}

export async function generatePlaywrightMocks(
  responses: RecordedResponse[],
  testInfo: TestInfo,
): Promise<void> {
  if (responses.length === 0) {
    console.log("No responses to record");
    return;
  }

  const playwrightDir = join(process.cwd(), "tests", "playwright");
  const relativePath = relative(playwrightDir, testInfo.file);
  const mockFileName = relativePath.replace(/\.test\.ts$/, ".mock.ts");
  const mockFilePath = join(playwrightDir, "mocking", "mocks", mockFileName);
  const sharedBodiesDir = join(
    playwrightDir,
    "mocking",
    "mocks",
    "shared-bodies",
  );

  interface MockTree {
    [key: string]: MockTree;
  }
  let mocks = {} as MockTree;

  if (existsSync(mockFilePath)) {
    try {
      const fileContent = readFileSync(mockFilePath, "utf-8");
      const match = fileContent.match(
        /const mocks = ({[\s\S]*?});?\s*export default mocks;/,
      );
      if (match) {
        mocks = JSON.parse(match[1]) as MockTree;
      }
    } catch (error) {
      console.warn(`Failed to read existing mocks, starting fresh: ${error}`);
    }
  }

  for (const response of responses) {
    let current = mocks;
    for (const pathSegment of response.testPath) {
      if (!current[pathSegment]) {
        current[pathSegment] = {} as MockTree;
      }
      current = current[pathSegment];
    }

    if (!current[response.endpoint]) {
      current[response.endpoint] = {} as MockTree;
    }

    const bodyStr =
      typeof response.body === "string"
        ? response.body
        : JSON.stringify(response.body);

    let body: unknown = response.body;
    if (bodyStr.length > SHARED_BODY_THRESHOLD) {
      const hash = createHash("sha256").update(bodyStr).digest("hex");
      mkdirSync(sharedBodiesDir, { recursive: true });
      const sharedBodyPath = join(sharedBodiesDir, `${hash}.json`);
      if (!existsSync(sharedBodyPath)) {
        writeFileSync(sharedBodyPath, bodyStr, "utf-8");
      }
      body = `__shared_body::${hash}`;
    }

    const entry: Record<string, unknown> = { body };
    if (response.status !== 200) {
      entry.status = response.status;
    }
    const filteredHeaders = filterHeaders(response.headers, response.url);
    if (filteredHeaders) {
      entry.headers = filteredHeaders;
    }

    (current[response.endpoint] as Record<string, unknown>)[response.index] =
      entry;
  }

  const tsContent = `/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

const mocks = ${JSON.stringify(mocks)};

export default mocks;
`;

  mkdirSync(dirname(mockFilePath), { recursive: true });
  writeFileSync(mockFilePath, tsContent, "utf-8");

  console.log(
    `✅ Generated mocks for ${testInfo.titlePath.join(" > ")} at ${mockFilePath}`,
  );
}

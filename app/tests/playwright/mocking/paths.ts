/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { join, relative } from "path";

export default function getMockFilePath(testFile: string): string {
  const playwrightDir = join(process.cwd(), "tests", "playwright");
  const relativePath = relative(playwrightDir, testFile);
  const mockFileName = relativePath.replace(/\.test\.ts$/, ".mock.ts");
  return join(playwrightDir, "mocking", "mocks", mockFileName);
}

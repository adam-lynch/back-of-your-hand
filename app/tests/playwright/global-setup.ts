/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { execSync } from "child_process";
import path from "path";

export default function globalSetup(): void {
  if (process.env.PLAYWRIGHT_BACKEND !== "local") {
    return;
  }

  const backendDir = process.env.BOYH_BACKEND_DIR;
  if (!backendDir) {
    throw new Error(
      "BOYH_BACKEND_DIR must be set for local mode. " +
        "Add it to app/.env.local or export it in your shell.",
    );
  }

  const scriptPath = path.join(backendDir, "scripts/playwright-setup.sh");
  execSync(scriptPath, { stdio: "inherit" });
}

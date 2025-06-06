/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2025 Adam Lynch (https://adamlynch.com)
 */

import { commentableExtensionsWhichPrettierSupports } from "../../build/fileExtensions.mjs";

const eslint = "eslint --config eslint.config.js --fix";
const prettier = "prettier --write";

export default {
  [`*.{${commentableExtensionsWhichPrettierSupports.join(",")}}`]: [
    prettier,
    eslint,
  ],
  "*.{json,md}": [prettier],
};

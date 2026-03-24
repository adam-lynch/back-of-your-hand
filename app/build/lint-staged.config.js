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

const ignoreMocks = (files) =>
  files.filter((f) => !f.includes("/mocking/mocks/"));

export default {
  [`*.{${commentableExtensionsWhichPrettierSupports.join(",")}}`]: (files) => {
    const filtered = ignoreMocks(files);
    if (filtered.length === 0) return [];
    const paths = filtered.join(" ");
    return [`${prettier} ${paths}`, `${eslint} ${paths}`];
  },
  "*.{json,md}": (files) => {
    const filtered = ignoreMocks(files);
    if (filtered.length === 0) return [];
    return [`${prettier} ${filtered.join(" ")}`];
  },
};

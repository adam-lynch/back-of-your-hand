/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

export const fileExtensionsWhichSupportComments = [
  "css",
  "html",
  "js",
  "sh",
  "svelte",
  "ts",
  "yaml",
  "yml",
];
const commentableExtensionsWhichPrettierSupports =
  fileExtensionsWhichSupportComments.filter(
    (extension) => !["sh", "yaml", "yml"].includes(extension),
  );

const eslint = "eslint --fix";
const licenseHeader = "node ./build/licenseHeader/lint.js --write";
const prettier = "prettier --write";

export default {
  [`*.{${commentableExtensionsWhichPrettierSupports.join(",")}}`]: [
    licenseHeader,
    prettier,
    eslint,
  ],
  "*.{json,md}": [prettier],
  [`*.{sh,yaml,yml}`]: [licenseHeader],
};

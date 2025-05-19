/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import fs from "fs";
import { globSync } from "glob";
import createIgnoreInstance from "ignore";
import path from "path";
import { fileExtensionsWhichSupportComments } from "../fileExtensions.mjs";

// extension to header comment string
let cache = {};
function makeLicenseHeaderComment(extension) {
  if (!cache[extension]) {
    let firstLinePrefix = "";
    let middleLinePrefix = "";
    let lastLinePrefix = "";
    let lastLineSuffix = "";

    if (["css", "js", "ts"].includes(extension)) {
      middleLinePrefix = " * ";
      firstLinePrefix = `/* \n${middleLinePrefix}`;
      lastLinePrefix = middleLinePrefix;
      lastLineSuffix = "\n */";
    } else if (["html", "svelte"].includes(extension)) {
      middleLinePrefix = "  ";
      firstLinePrefix = `<!--\n${middleLinePrefix}`;
      lastLinePrefix = middleLinePrefix;
      lastLineSuffix = "\n-->";
    } else if (["sh", "yaml", "yml"].includes(extension)) {
      firstLinePrefix = `# `;
      middleLinePrefix = firstLinePrefix;
      lastLinePrefix = firstLinePrefix;
    } else {
      throw new Error(`Unknown extension (${extension})`);
    }

    if (!cache.raw) {
      cache.raw = fs
        .readFileSync("./build/licenseHeader/header.txt", "utf8")
        .replace("$YEAR", new Date().getFullYear());
    }

    cache[extension] = cache.raw
      .split("\n")
      .map((rawLine, index, rawLines) => {
        if (index === 0) {
          return firstLinePrefix + rawLine;
        }
        if (index === rawLines.length - 1) {
          return lastLinePrefix + rawLine + lastLineSuffix;
        }
        return middleLinePrefix + rawLine;
      })
      .join("\n");
  }

  return cache[extension];
}

let filePathsToCheck = [];
let shouldModifyFiles = process.argv.includes("--write");

if (process.argv.includes("--all")) {
  const ignoreInstance = createIgnoreInstance();
  for (const ignoreFilePath of [".gitignore", ".prettierignore"]) {
    if (fs.existsSync(ignoreFilePath)) {
      ignoreInstance.add(fs.readFileSync(ignoreFilePath).toString());
    }
  }
  filePathsToCheck = globSync(
    `./**/*.{${fileExtensionsWhichSupportComments.join(",")}}`,
  ).filter((filePath) => !ignoreInstance.ignores(filePath));
} else {
  filePathsToCheck = process.argv
    .slice(2)
    .filter((item) => !item.startsWith("--"));
}

filePathsToCheck.sort();

let filePathsMissingHeader = [];

for (const filePath of filePathsToCheck) {
  const content = fs.readFileSync(filePath, "utf8");
  const extension = path.extname(filePath).replace(/^./, "");
  const licenseHeader = makeLicenseHeaderComment(extension);

  if (content.startsWith(licenseHeader.split("\n")[0].trim())) {
    continue;
  }

  if (shouldModifyFiles) {
    const updatedContent = licenseHeader + "\n\n" + content;
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Added license header comment to ${filePath}`);
  } else {
    filePathsMissingHeader.push(filePath);
  }
}

if (!shouldModifyFiles && filePathsMissingHeader.length) {
  let message = "Files missing license header comment:\n";
  message += filePathsMissingHeader.map((filePath) => `\n${filePath}`).join("");
  console.error(message);
  process.exit(1);
}

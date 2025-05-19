/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type { Overpass } from "../library/game/types";

const isUsableAlternativeName = (
  alternativeName: string | void,
  mainName: string,
): alternativeName is string =>
  Boolean(
    alternativeName &&
      alternativeName !== mainName &&
      !["-", "n/a"].includes(alternativeName.trim().toLowerCase()),
  );

const getAlternativeName = (
  element: Overpass.Element,
  mainName: string,
): { languageCode?: string; name: string } | void => {
  if (isUsableAlternativeName(element.tags["name:ga"], mainName)) {
    return {
      languageCode: "ga",
      name: element.tags["name:ga"],
    };
  }

  if (isUsableAlternativeName(element.tags.old_name, mainName)) {
    return { name: element.tags.old_name };
  }

  if (isUsableAlternativeName(element.tags.loc_name, mainName)) {
    return { name: element.tags.loc_name };
  }
};

type Result = {
  alternativeName?: string;
  alternativeNameLanguageCode?: string;
  name: string;
};

// Up to two names
export default (element: Overpass.Element): Result => {
  const result: Result = { name: element.tags.name };

  const alternativeNameDetails = getAlternativeName(element, element.tags.name);
  if (alternativeNameDetails) {
    result.alternativeName = alternativeNameDetails.name;
    result.alternativeNameLanguageCode = alternativeNameDetails.languageCode;
  }

  return result;
};

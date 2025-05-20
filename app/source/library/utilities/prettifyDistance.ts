/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2025 Adam Lynch (https://adamlynch.com)
 */

import pluralize from "../../utilities/pluralize";
import { isOrganizationUrl } from "../../userData/store";
import { get } from "svelte/store";
import roundNumber from "../../utilities/roundNumber";

type UnitDescription = {
  name: string;
  maximumAmountToShow?: number;
  numberOfDecimalPlacesToRoundTo?: number;
  pluralizedName?: string;
};

export default function prettifyDistance(distanceInMetres: number): string {
  let amount = distanceInMetres;
  const unitClass = get(isOrganizationUrl) ? "imperial" : "metric";

  const unitDescriptions: UnitDescription[] =
    unitClass === "metric"
      ? [
          {
            name: "metre",
            maximumAmountToShow: 1000,
          },
          {
            name: "kilometre",
            numberOfDecimalPlacesToRoundTo: 1,
          },
        ]
      : [
          {
            name: "foot",
            maximumAmountToShow: 5280,
            pluralizedName: "feet",
          },
          {
            name: "mile",
            numberOfDecimalPlacesToRoundTo: 1,
          },
        ];

  let unitDescriptionToUse = unitDescriptions[0];

  if (
    unitDescriptionToUse.maximumAmountToShow &&
    amount > unitDescriptionToUse.maximumAmountToShow
  ) {
    amount = amount / unitDescriptionToUse.maximumAmountToShow;
    unitDescriptionToUse = unitDescriptions[1];
  }

  amount = roundNumber(
    amount,
    unitDescriptionToUse.numberOfDecimalPlacesToRoundTo ?? 0,
  );

  let suffix = unitDescriptionToUse.name;

  if (amount !== 1) {
    suffix =
      unitDescriptionToUse.pluralizedName ||
      pluralize(unitDescriptionToUse.name);
  }

  return `${amount.toLocaleString()} ${suffix}`;
}

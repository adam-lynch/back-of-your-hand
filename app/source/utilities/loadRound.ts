/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { get } from "svelte/store";

import delay from "./delay";
import getData from "./getData";
import getRandomNumberGenerator from "./getRandomNumberGenerator";
import {
  isAreaConfirmed,
  isLoading,
  round,
  seed,
  type AreaSelection,
} from "./store";
import { Difficulty } from "../library/game/types";

let getRandomNumber: ReturnType<typeof getRandomNumberGenerator>;
export default async ({
  areaSelection,
  difficulty,
  isOrganizationUrl,
  numberOfQuestions,
}: {
  areaSelection: AreaSelection;
  difficulty: Difficulty;
  isOrganizationUrl: boolean;
  numberOfQuestions: number;
  radius: number;
}) => {
  isLoading.set(true);

  if (!getRandomNumber) {
    getRandomNumber = getRandomNumberGenerator(get(seed));
  }
  const targets = await getData({
    areaSelection,
    difficulty,
    getRandomNumber,
    numberOfQuestions,
  });

  let alertMessage: string | null = null;

  if (targets.length === 0) {
    alertMessage =
      "There are no streets or points of interest in this area. Please select another area";
  } else if (targets.length < numberOfQuestions && !isOrganizationUrl) {
    await delay(200); // Make sure zoom-in has finished
    if (targets.length < 5) {
      alertMessage =
        "There aren't enough streets or points of interest in this area (minimum 5 required). Please select another area";
    } else {
      alertMessage = `There are only ${targets.length} streets or points of interest in this area. Please reduce the "Questions per round" setting (currently set to ${numberOfQuestions})`;
    }
  }

  if (alertMessage) {
    let suffix = "";
    if (difficulty !== Difficulty.TaxiDriver) {
      suffix = " or increase the difficulty so more streets are included";
    }
    alert(alertMessage + suffix);

    isAreaConfirmed.set(false);
    isLoading.set(false);
    return;
  }

  round.set({
    questions: targets.map((target, index) => ({
      target,
      index,
      status: index === 0 ? "ongoing" : "pending",
    })),
    status: "ongoing",
  });

  isLoading.set(false);
};

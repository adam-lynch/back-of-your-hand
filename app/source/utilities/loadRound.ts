/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as svelteStore from "svelte/store";

import delay from "./delay";
import getData from "./getData";
import getRandomNumberGenerator from "./getRandomNumberGenerator";
import {
  isAreaConfirmed,
  isLoading,
  gameRound,
  seed,
  type AreaSelection,
} from "./store";
import { Difficulty } from "../library/game/types";
import api from "../api";
import type { Round, UserOrganization } from "../api/resourceObjects";

let getRandomNumber: ReturnType<typeof getRandomNumberGenerator>;
export default async ({
  areaSelection,
  difficulty,
  isOrganizationUrl,
  numberOfQuestions,
  userOrganization,
}: {
  areaSelection: AreaSelection;
  difficulty: Difficulty;
  isOrganizationUrl: boolean;
  numberOfQuestions: number;
  radius: number;
  userOrganization: UserOrganization | null;
}) => {
  isLoading.set(true);

  if (!getRandomNumber) {
    getRandomNumber = getRandomNumberGenerator(svelteStore.get(seed));
  }
  const targets = await getData({
    areaSelection,
    difficulty,
    getRandomNumber,
    isOrganizationUrl,
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

  let roundId = "local-only";

  if (isOrganizationUrl) {
    if (!userOrganization) {
      throw new Error("No userOrganization");
    }

    const newRound = await api.postResource<Round>({
      attributes: {
        questionAmount: numberOfQuestions,
        score: 0,
        status: "ongoing",
      },
      relationships: {
        area: {
          data: areaSelection.areaId
            ? {
                id: areaSelection.areaId,
                type: "area",
              }
            : null,
        },
        userorganization: {
          data: {
            id: userOrganization.id,
            type: "userOrganization",
          },
        },
      },
      type: "round",
    });

    roundId = newRound.data.id;
  }

  gameRound.set({
    id: roundId,
    questions: targets.map((target, index) => ({
      target,
      index,
      status: index === 0 ? "ongoing" : "pending",
    })),
    status: "ongoing",
  });

  isLoading.set(false);
};

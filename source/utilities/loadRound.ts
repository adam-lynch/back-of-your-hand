import { get } from "svelte/store";

import delay from "./delay";
import getData from "./getData";
import getRandomNumberGenerator from "./getRandomNumberGenerator";
import { isAreaConfirmed, isLoading, round, seed } from "../store";
import { Difficulty, LatLng } from "./types";

let getRandomNumber;
export default async ({
  areaCenter,
  areaBounds,
  difficulty,
  numberOfQuestions,
  radius,
}) => {
  isLoading.set(true);

  if (!getRandomNumber) {
    getRandomNumber = getRandomNumberGenerator(get(seed));
  }
  const targets = await getData({
    areaBounds,
    centerLatLng: areaCenter as LatLng,
    difficulty,
    radius,
    getRandomNumber,
    numberOfQuestions,
  });

  if (targets.length < numberOfQuestions) {
    await delay(200); // Make sure zoom-in has finished
    let errorSuffix = "";
    if (difficulty !== Difficulty.Tourist) {
      errorSuffix = " or increase the difficulty so more streets are included";
    }
    if (targets.length < 5) {
      alert(
        `There aren't enough streets or points of interest in this area (minimum 5 required). Please select another area${errorSuffix}`
      );
    } else {
      alert(
        `There are only ${targets.length} streets or points of interest in this area. Please reduce the "Questions per round" setting (currently set to ${numberOfQuestions})${errorSuffix}`
      );
    }
    isAreaConfirmed.set(false);
    isLoading.set(false);
    return;
  }

  round.set({
    areaBounds: areaBounds,
    questions: targets.map((target, index) => ({
      target,
      index,
      status: index === 0 ? "ongoing" : "pending",
    })),
    status: "ongoing",
  });

  isLoading.set(false);
};

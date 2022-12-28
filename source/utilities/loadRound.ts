import { get } from "svelte/store";

import delay from "./delay";
import getData from "./getData";
import getRandomNumberGenerator from "./getRandomNumberGenerator";
import { isAreaConfirmed, isLoading, round, seed } from "../store";
import type { LatLng } from "./types";

let getRandomNumber;
export default async ({ areaCenter, areaBounds, numberOfStreets, radius }) => {
  isLoading.set(true);

  if (!getRandomNumber) {
    getRandomNumber = getRandomNumberGenerator(get(seed));
  }
  const targets = await getData(
    areaBounds,
    areaCenter as LatLng,
    radius,
    getRandomNumber,
    numberOfStreets
  );

  if (targets.length < numberOfStreets) {
    await delay(200); // Make sure zoom-in has finished
    if (targets.length < 5) {
      alert(
        "There aren't enough streets or points of interest in this area (minimum 5 required). Please select somewhere else"
      );
    } else {
      alert(
        `There are only ${targets.length} streets or points of interest in this area. Please reduce the "Questions per round" setting (currently set to ${numberOfStreets})`
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

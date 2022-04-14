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
  const streets = await getData(
    areaBounds,
    areaCenter as LatLng,
    radius,
    getRandomNumber,
    numberOfStreets
  );

  if (streets.length < numberOfStreets) {
    await delay(200); // Make sure zoom-in has finished
    alert(
      "There aren't enough streets in this area. Please select somewhere else"
    );
    isAreaConfirmed.set(false);
    isLoading.set(false);
    return;
  }

  round.set({
    areaBounds: areaBounds,
    questions: streets.map((street, index) => ({
      street,
      index,
      status: index === 0 ? "ongoing" : "pending",
    })),
    status: "ongoing",
  });

  isLoading.set(false);
};

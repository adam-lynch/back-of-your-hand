import delay from "./delay";
import getData from "./getData";
import getRandomNumberGenerator from "./getRandomNumberGenerator";
import getSeed from "./getSeed";
import { isAreaConfirmed, isLoading, round } from "../store";
import type { LatLng } from "./types";

const [_areaCenter, seedFromUrl] = window.location.pathname
  .split("/")
  .filter(Boolean);

let getRandomNumber;
export default async ({
  areaCenter,
  areaBounds,
  gotInitialSeedFromUrl,
  numberOfStreets,
  radius,
}) => {
  isLoading.update(() => true);

  const seed = gotInitialSeedFromUrl ? seedFromUrl : getSeed();
  if (!getRandomNumber) {
    getRandomNumber = getRandomNumberGenerator(seed);
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
    isAreaConfirmed.update(() => false);
    isLoading.update(() => false);
    return;
  }

  round.update(() => ({
    areaBounds: areaBounds,
    questions: streets.map((street, index) => ({
      street,
      index,
      status: index === 0 ? "ongoing" : "pending",
    })),
    seed,
    status: "ongoing",
  }));

  isLoading.update(() => false);
};

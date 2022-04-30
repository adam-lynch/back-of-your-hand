import type leaflet from "leaflet";
import { derived, writable } from "svelte/store";

import getInitialAreaCenter from "./utilities/getInitialAreaCenter";
import getInitialAreaRadius from "./utilities/getInitialAreaRadius";
import getSeed from "./utilities/getSeed";
import ignoreError from "./utilities/ignoreError";
import isTouchDevice from "./utilities/isTouchDevice";
import parseSeedFromUrl from "./utilities/parseSeedFromUrl";
import type { LatLng, Round } from "./utilities/types";

export const areaBounds = writable<leaflet.LatLngBounds>(null);
export const areaCenter = writable<LatLng>(getInitialAreaCenter());
export const areaRadius = writable<number>(getInitialAreaRadius());
export const geolocationRequesterStatus = writable<
  null | "denied" | "pre-prompt" | "prompted"
>(null);
export const deviceBestScore = writable<number | null>(
  parseInt(
    ignoreError(() => {
      let storedValue = localStorage.getItem("deviceBestScore");
      if (!storedValue) {
        return;
      }
      let score = parseInt(storedValue, 10);
      // We used to show the score as "350 / 500" for example, rather than 70%
      if (score > 100) {
        score = Math.round(score / 5);
        ignoreError(() =>
          localStorage.setItem("deviceBestScore", score.toString())
        );
      }
      return score;
    }) as unknown as string
  ) || null
);
export const chosenPoint = writable(null);

const seedFromUrl = parseSeedFromUrl();
export const gotInitialSeedFromUrl = writable(Boolean(seedFromUrl));

export const isAreaConfirmed = writable(false);
export const isChosenPointConfirmed = writable(false);
export const interactionVerb = writable(isTouchDevice() ? "Tap" : "Click");
export const isLoading = writable(false);
export const ongoingZoomCount = writable(0);
export const isZooming = derived(ongoingZoomCount, ($value) => $value > 0);
export const isSummaryShown = writable(false);
export const numberOfStreets = writable(5);
export const round = writable<Round>(null);
export const seed = writable<string>(seedFromUrl || getSeed());

export const orderedQuestions = derived(round, ($value) => {
  if (!$value || !$value.questions || !$value.questions.length) {
    return null;
  }
  return $value.questions.sort(
    (questionA, questionB) => questionA.index - questionB.index
  );
});

export const currentQuestion = derived(orderedQuestions, ($value) => {
  if (!$value || !$value.length) {
    return null;
  }
  return (
    $value.find(({ status }) => status === "ongoing") ||
    $value
      .filter(({ status }) => status === "complete")
      .reverse()
      .find(Boolean)
  );
});
export const currentQuestionIndex = derived(currentQuestion, ($value) => {
  if ($value) {
    return $value.index;
  }
});

export const nextQuestion = derived(orderedQuestions, ($value) => {
  if (!$value || !$value.length) {
    return null;
  }
  return $value.find(({ status }) => status === "pending");
});

export const totalScore = derived(round, ($value) => {
  if (!$value) {
    return null;
  }
  return $value.questions.reduce((sum, question) => sum + question.score, 0);
});

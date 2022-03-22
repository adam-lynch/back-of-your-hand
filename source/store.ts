import { derived, writable } from "svelte/store";
import getInitialAreaCenter from "./utilities/getInitialAreaCenter";
import getInitialAreaRadius from "./utilities/getInitialAreaRadius";
import ignoreError from "./utilities/ignoreError";
import isTouchDevice from "./utilities/isTouchDevice";

export const areaBounds = writable(null);
export const areaCenter = writable(getInitialAreaCenter());
export const areaRadius = writable(getInitialAreaRadius());
export const deviceBestScore = writable(
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

const pathSegments = window.location.pathname
  .split("/")
  .filter((segment) => segment && segment !== "geo-lookup-done");
export const gotInitialSeedFromUrl = writable(
  pathSegments.length === 2 && pathSegments[1].length
);

export const isAreaConfirmed = writable(false);
export const isChosenPointConfirmed = writable(false);
export const interactionVerb = writable(isTouchDevice() ? "Tap" : "Click");
export const isLoading = writable(false);
export const isSummaryShown = writable(false);
export const numberOfStreets = writable(5);
export const round = writable(null);
export const seedFromUrl = writable(null);

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

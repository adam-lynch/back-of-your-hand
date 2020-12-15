import { derived, writable } from "svelte/store";
import getInitialAreaCenter from "./utilities/getInitialAreaCenter";
import ignoreError from "./utilities/ignoreError";
import isTouchDevice from "./utilities/isTouchDevice";

export const areaBounds = writable(null);
export const areaCenter = writable(getInitialAreaCenter());
export const areaRadius = writable(2500);
export const deviceBestScore = writable(
  parseInt(
    ignoreError(() => localStorage.getItem("deviceBestScore")) as string
  ) || null
);
export const chosenPoint = writable(null);

const pathSegments = window.location.pathname.split("/").filter(Boolean);
export const gotInitialSeedFromUrl = writable(
  pathSegments.length === 2 && pathSegments[1].length
);

export const isAreaConfirmed = writable(false);
export const isChosenPointConfirmed = writable(false);
export const interactionVerb = writable(isTouchDevice() ? "Tap" : "Click");
export const isLoading = writable(false);
export const isSummaryShown = writable(false);
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

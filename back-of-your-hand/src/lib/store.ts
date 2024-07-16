import type leaflet from "leaflet";
import { derived, writable } from "svelte/store";

import getInitialAreaCenter from "./utilities/getInitialAreaCenter";
import getInitialSettingValue from "./utilities/getInitialSettingValue";
import getSeed from "./utilities/getSeed";
import ignoreError from "./utilities/ignoreError";
import isTouchDevice from "./utilities/isTouchDevice";
import { Difficulty } from "./utilities/types";
import type { LatLng, Round } from "./utilities/types";

const initialUrlSearchParams = new URLSearchParams(window.location.search);

export const areaBounds = writable<leaflet.LatLngBounds | null>(null);
export const areaCenter = writable<LatLng>(
  getInitialAreaCenter(initialUrlSearchParams),
);
export const areaRadius = writable(
  getInitialSettingValue<number>({
    defaultValue: 2000,
    name: "radius",
    parse: (input) => {
      if (input) {
        return parseInt(input);
      }
    },
    urlSearchParams: initialUrlSearchParams,
  }),
);

export const difficulty = writable(
  getInitialSettingValue<Difficulty>({
    defaultValue: Difficulty.TaxiDriver,
    name: "difficulty",
    parse: (input) => {
      if (input && Object.values(Difficulty).includes(input as Difficulty)) {
        return input as Difficulty;
      }
    },
    urlSearchParams: initialUrlSearchParams,
  }),
);

export const numberOfQuestions = writable(
  getInitialSettingValue<number>({
    defaultValue: 5,
    name: "numberOfQuestions",
    parse: (input) => {
      if (input) {
        return parseInt(input);
      }
    },
    urlSearchParams: initialUrlSearchParams,
  }),
);

export const settingsLastOpenedAt = writable<number | null>(
  ignoreError(() => {
    const unparsed = localStorage.getItem("settingsLastOpenedAt");
    if (unparsed) {
      return parseInt(unparsed);
    }
  }) || null,
);

export const geolocationRequesterStatus = writable<
  null | "denied" | "pre-prompt" | "prompted"
>(null);
export const deviceBestScore = writable<number | null>(
  parseInt(
    ignoreError(() => {
      const storedValue = localStorage.getItem("deviceBestScore");
      if (!storedValue) {
        return;
      }
      let score = parseInt(storedValue, 10);
      // We used to show the score as "350 / 500" for example, rather than 70%
      if (score > 100) {
        score = Math.round(score / 5);
        ignoreError(() =>
          localStorage.setItem("deviceBestScore", score.toString()),
        );
      }
      return score;
    }) as unknown as string,
  ) || null,
);
export const chosenPoint = writable<LatLng | null>(null);

const sharedSeedFromUrl = initialUrlSearchParams.get("sharedSeed");
if (sharedSeedFromUrl) {
  initialUrlSearchParams.delete("sharedSeed");
}
export const didOpenMultiplayerSessionUrl = writable(
  Boolean(sharedSeedFromUrl),
);

export const isAreaConfirmed = writable(false);
export const isChosenPointConfirmed = writable(false);
export const interactionVerb = writable(isTouchDevice() ? "Tap" : "Click");
export const isLoading = writable(false);
export const ongoingZoomCount = writable(0);
export const isZooming = derived(ongoingZoomCount, ($value) => $value > 0);
export const sidebarState = writable<
  "default" | "creating-multiplayer-session" | "summary"
>("default");
export const round = writable<Round | null>(null);
export const seed = writable<string>(
  (didOpenMultiplayerSessionUrl && sharedSeedFromUrl) || getSeed(),
);

export const gameUrl = derived(
  [areaCenter, areaRadius, difficulty, numberOfQuestions],
  ([$areaCenter, $areaRadius, $difficulty, $numberOfQuestions]) => {
    const url = new URL(window.location.origin);
    url.pathname = "/game";
    url.searchParams.set("difficulty", $difficulty);
    url.searchParams.set("lat", $areaCenter.lat.toString());
    url.searchParams.set("lng", $areaCenter.lng.toString());
    url.searchParams.set("numberOfQuestions", $numberOfQuestions.toString());
    url.searchParams.set("radius", $areaRadius.toString());
    return url.toString();
  },
);

export const multiplayerSessionJoinUrl = derived(
  [gameUrl, seed],
  ([$gameUrl, $seed]) => `${$gameUrl}&sharedSeed=${$seed}`,
);

export const orderedQuestions = derived(round, ($value) => {
  if (!$value || !$value.questions || !$value.questions.length) {
    return null;
  }
  return $value.questions.sort(
    (questionA, questionB) => questionA.index - questionB.index,
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
  return $value.questions.reduce(
    (sum, question) => sum + (question.score ?? 0),
    0,
  );
});

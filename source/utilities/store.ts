/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type * as geojson from "geojson";
import { derived, get, writable } from "svelte/store";

import getInitialAreaCenter from "./getInitialAreaCenter";
import getInitialSettingValue from "./getInitialSettingValue";
import getSeed from "./getSeed";
import ignoreError from "./ignoreError";
import isTouchDevice from "./isTouchDevice";
import { Difficulty } from "../library/game/types";
import type { LatLng, Round } from "../library/game/types";
import { PresetAreaShape } from "../library/game/types";
import createFeatureFromPresetAreaShape from "./createFeatureFromPresetAreaShape";
import convertLatLngToPosition from "./convertLatLngToPosition";
import * as defaults from "./defaults";
import setWritableIfDifferent from "./setWritableIfDifferent";
import getCenterOfFeature from "./getCenterOfFeature";
import convertPositionToLatLng from "./convertPositionToLatLng";
import type { Area } from "../api/resourceObjects";
import subscribeIfNotDeepEqual from "../library/utilities/subscribeIfNotDeepEqual";

export const initialUrlSearchParams = new URLSearchParams(
  window.location.search,
);

export const areaCenter = writable<LatLng>(
  getInitialAreaCenter(initialUrlSearchParams),
);
export const areaRadius = writable(
  getInitialSettingValue<number>({
    defaultValue: defaults.radius,
    name: "radius",
    parse: (input) => {
      if (input) {
        return parseInt(input);
      }
    },
    urlSearchParams: initialUrlSearchParams,
  }),
);

export const areaShape = writable(
  getInitialSettingValue<PresetAreaShape>({
    defaultValue: defaults.shape,
    name: "shape",
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

export const hasEverPlayedARoundOnThisDevice =
  typeof localStorage.getItem("deviceBestScore") === "string";

export const lastAreaSelectionAreaId = writable(
  getInitialSettingValue<string | null | undefined>({
    defaultValue: null,
    name: "lastAreaSelectionAreaId",
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

export type AreaSelection = {
  areaId: Area["id"] | null;
  feature: geojson.Feature<
    | GeoJSON.MultiPolygon
    // Polygon is for circle and square, never anything else
    | GeoJSON.Polygon
  >;
  presetShape: PresetAreaShape;
  radius: number | null;
};

const initialAreaSelectionShape =
  get(areaShape) === PresetAreaShape.MultiPolygon
    ? PresetAreaShape.Circle
    : get(areaShape);
const initialAreaSelectionRadius = get(areaRadius);
const initialAreaSelectionFeature = createFeatureFromPresetAreaShape(
  initialAreaSelectionShape,
  convertLatLngToPosition(get(areaCenter)),
  initialAreaSelectionRadius,
);

export const areaSelection = writable<AreaSelection>({
  areaId: null,
  feature: initialAreaSelectionFeature,
  presetShape: initialAreaSelectionShape,
  radius: initialAreaSelectionRadius,
});

subscribeIfNotDeepEqual(areaSelection, (value) => {
  const centerPosition = getCenterOfFeature(value.feature);
  setWritableIfDifferent(areaCenter, convertPositionToLatLng(centerPosition));
  setWritableIfDifferent(areaRadius, value.areaId ? null : value.radius);
  setWritableIfDifferent(areaShape, value.presetShape);
});

export const round = writable<Round | null>(null);
export const seed = writable<string>(
  (didOpenMultiplayerSessionUrl && sharedSeedFromUrl) || getSeed(),
);

export const gameUrl = derived(
  [areaCenter, areaRadius, areaShape, difficulty, numberOfQuestions],
  ([$areaCenter, $areaRadius, $areaShape, $difficulty, $numberOfQuestions]) => {
    const url = new URL(window.location.origin);
    url.pathname = "/game";
    url.searchParams.set("difficulty", $difficulty);
    url.searchParams.set("lat", $areaCenter.lat.toString());
    url.searchParams.set("lng", $areaCenter.lng.toString());
    url.searchParams.set("numberOfQuestions", $numberOfQuestions.toString());
    if ($areaRadius !== null) {
      url.searchParams.set("radius", $areaRadius.toString());
    }
    if ($areaShape !== PresetAreaShape.MultiPolygon) {
      url.searchParams.set("shape", $areaShape);
    }
    return url.toString();
  },
);

export const multiplayerSessionJoinUrl = derived(
  [gameUrl, seed, areaSelection],
  ([$gameUrl, $seed, $areaSelection]) => {
    let result = `${$gameUrl}&sharedSeed=${$seed}`;
    if ($areaSelection.areaId) {
      result += `&areaIdForMultiplayer=${$areaSelection.areaId}`;
    }
    return result;
  },
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

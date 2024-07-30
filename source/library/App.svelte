<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import debounce from "lodash/debounce";
  import { writable } from "svelte/store";

  import GeolocationRequester from "./GeolocationRequester.svelte";
  import HUD from "./HUD.svelte";
  import ContextPanel from "./ContextPanel.svelte";
  import FatalErrorDisplay from "./FatalErrorDisplay.svelte";
  import Map from "./Map.svelte";
  import computeTotalScore from "../utilities/computeTotalScore";
  import ignoreError from "../utilities/ignoreError";
  import {
    areaBounds,
    areaCenter,
    areaRadius,
    currentQuestion,
    deviceBestScore,
    difficulty,
    gameUrl,
    isAreaConfirmed,
    nextQuestion,
    numberOfQuestions,
    round,
    totalScore,
  } from "../utilities/store";
  import loadRound from "../utilities/loadRound";
  import type { LatLng } from "../utilities/types";
  import trackEvent from "../utilities/trackEvent";
  import { defineCustomElements } from "./customElements";

  export let unhandledError: Error | null = null;

  defineCustomElements();

  let areSettingsShown = writable(false);

  let lastSeenSeed: string | undefined;

  const updateUrl = debounce(
    () => {
      history.replaceState(null, "", $gameUrl);
    },
    250,
    { trailing: true },
  );

  // Update the URL path when the area center changes
  areaCenter.subscribe((value: LatLng) => {
    if (!value) {
      return;
    }
    if (!value.lng) {
      console.error(typeof value, value);
      throw new Error("areaCenter:setItem, lng doesn't exist");
    }
    updateUrl();
    trackEvent({ name: "area-center-moved", title: "Area center moved" });
  });

  areaRadius.subscribe((value: number) => {
    if (!value) {
      return;
    }

    updateUrl();
  });

  difficulty.subscribe(() => updateUrl());

  numberOfQuestions.subscribe((value: number) => {
    if (!value) {
      return;
    }

    updateUrl();
  });

  // Load round of streets once area is confirmed
  isAreaConfirmed.subscribe(async (isConfirmed) => {
    if (!isConfirmed) {
      return;
    }

    if (!$areaBounds) {
      throw new Error("no areaBounds");
    }

    loadRound({
      areaBounds: $areaBounds,
      areaCenter: $areaCenter,
      difficulty: $difficulty,
      numberOfQuestions: $numberOfQuestions,
      radius: $areaRadius,
    });

    ignoreError(() => {
      localStorage.setItem("centerLatLng", JSON.stringify($areaCenter));

      localStorage.setItem("difficulty", $difficulty);
      localStorage.setItem("radius", $areaRadius.toString());
    });
  });

  // To be safe, complete the round when the final question is complete
  currentQuestion.subscribe((value) => {
    if (
      value &&
      value.status === "complete" &&
      !$nextQuestion &&
      $round &&
      $round.status !== "complete"
    ) {
      round.update((value) => {
        if (!value) {
          throw new Error("round is falsy");
        }
        return {
          ...value,
          status: "complete",
        };
      });
    }
  });

  // Do some stuff when the round is updated
  round.subscribe((value) => {
    if (!value) {
      return;
    }

    // TODO: fix and remove ts comments on seed
    // @ts-expect-error ...
    if (value.seed && value.seed !== lastSeenSeed) {
      updateUrl();
      // @ts-expect-error ...
      lastSeenSeed = value.seed;
    }

    // Once the round ends, see if a new personal best was set
    if (value.status === "complete") {
      if (!$round) {
        throw new Error("round is falsy");
      }
      if ($totalScore === null) {
        throw new Error("totalScore is undefined");
      }
      const newPotentialBestScore = computeTotalScore($totalScore, $round);
      if (newPotentialBestScore > ($deviceBestScore ?? 0)) {
        deviceBestScore.set(newPotentialBestScore);
        round.update((value) => {
          if (!value) {
            throw new Error("round is falsy");
          }
          return {
            ...value,
            didSetNewDeviceBestScore: true,
          };
        });
      }
    }
  });

  // Persist personal best
  deviceBestScore.subscribe((value) => {
    if (!value) {
      return;
    }
    ignoreError(() =>
      localStorage.setItem("deviceBestScore", value.toString()),
    );
  });
</script>

<main>
  {#if unhandledError}
    <FatalErrorDisplay error={unhandledError} />
  {:else}
    <!-- This is like a sidebar (but not really), I couldn't think of a better name -->
    <ContextPanel bind:areSettingsShown />
    <Map {areSettingsShown} />
    <p class="hide-accessibly"
      ><a href="#context-panel">Back to context panel</a></p
    >
    <HUD />
    <GeolocationRequester />
  {/if}
</main>

<style
  global
  lang="postcss"
>
  main {
    height: 100%;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      "map"
      "context-panel";
    overflow: hidden;
  }

  /* Swap the layout depending on width / aspect-ratio (move context panel to the side) */
  @media (min-width: 1200px),
    (min-aspect-ratio: 1.2/1),
    /* Browser support is poor for this,
    so we have to do this: */ (min-width: 1200px) and (max-height: 912px),
    (min-width: 1150px) and (max-height: 872px),
    (min-width: 1100px) and (max-height: 832px),
    (min-width: 1050px) and (max-height: 792px),
    (min-width: 1000px) and (max-height: 752px),
    (min-width: 950px) and (max-height: 712px),
    (min-width: 900px) and (max-height: 672px),
    (min-width: 850px) and (max-height: 632px),
    (min-width: 800px) and (max-height: 593px),
    (min-width: 750px) and (max-height: 553px),
    (min-width: 700px) and (max-height: 514px),
    (min-width: 650px) and (max-height: 474px),
    (min-width: 600px) and (max-height: 435px),
    (min-width: 550px) and (max-height: 395px),
    (min-width: 500px) and (max-height: 356px),
    (min-width: 450px) and (max-height: 316px),
    (min-width: 400px) and (max-height: 277px),
    (min-width: 350px) and (max-height: 237px),
    (min-width: 300px) and (max-height: 198px) {
    main {
      grid-template-columns: minmax(auto, 33%) 1fr;
      grid-template-rows: auto;
      grid-template-areas: "context-panel map";
    }
  }
</style>

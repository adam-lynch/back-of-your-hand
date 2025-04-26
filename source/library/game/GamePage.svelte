<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import debounce from "lodash/debounce";
  // import throttle from "lodash/throttle";
  import { onMount } from "svelte";
  import * as svelteStore from "svelte/store";

  import GeolocationRequester from "./GeolocationRequester.svelte";
  import HUD from "./HUD.svelte";
  import ContextPanel from "./ContextPanel.svelte";
  import FatalErrorDisplay from "../FatalErrorDisplay.svelte";
  import computeTotalScore from "../../utilities/computeTotalScore";
  import ignoreError from "../../utilities/ignoreError";
  import {
    areaCenter,
    areaRadius,
    areaSelection,
    areaShape,
    chosenPoint,
    currentQuestion,
    deviceBestScore,
    didOpenMultiplayerSessionUrl,
    difficulty,
    gameUrl,
    isAreaConfirmed,
    isChosenPointConfirmed,
    nextQuestion,
    numberOfQuestions,
    round,
    sidebarState,
    totalScore,
  } from "../../utilities/store";
  import loadRound from "../../utilities/loadRound";
  import type { LatLng } from "./types";
  import trackEvent from "../../utilities/trackEvent";
  import { defineCustomElements } from "../customElements";
  import { navigate } from "svelte-routing";
  import Page from "../Page.svelte";
  import getInternalRoutes from "../routing/getInternalRoutes";
  import {
    isLoggedIn,
    isOrganizationUrl,
    userOrganization,
  } from "../../userData/store";
  import setOrRemoveLocalStorageItem from "../../utilities/setOrRemoveLocalStorageItem";
  import api from "../../api";
  import type { Round } from "../../api/resourceObjects";
  import MapWrapper from "./MapWrapper.svelte";

  export let unhandledError: Error | null = null;

  const internalRoute = getInternalRoutes().game;

  defineCustomElements();

  let areSettingsShown = svelteStore.writable(false);

  let lastSeenSeed: string | undefined;

  const updateUrl = debounce(
    () => {
      if (
        svelteStore.get(isOrganizationUrl) &&
        svelteStore.get(isLoggedIn) === false
      ) {
        return;
      }
      const newUrl = svelteStore.get(gameUrl);
      if (newUrl === window.location.href) {
        return;
      }
      console.debug("Updating game URL...", newUrl);
      navigate(svelteStore.get(gameUrl), { replace: true });
    },
    250,
    { trailing: true },
  );

  function resetGame() {
    areSettingsShown.set(false);
    chosenPoint.set(null);
    isChosenPointConfirmed.set(false);
    isAreaConfirmed.set(false);
    round.set(null);
    didOpenMultiplayerSessionUrl.set(false);
    sidebarState.set("default");
  }

  onMount(() => {
    const unsubscribers: svelteStore.Unsubscriber[] = [];

    // Update the URL path when the area center changes
    unsubscribers.push(
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
      }),
    );

    unsubscribers.push(
      areaRadius.subscribe((value: number) => {
        if (!value) {
          return;
        }

        updateUrl();
      }),
    );

    unsubscribers.push(
      areaShape.subscribe((value) => {
        if (!value) {
          return;
        }
        updateUrl();
        trackEvent({ name: "area-shape-changed", title: "Area shape changed" });
      }),
    );

    unsubscribers.push(difficulty.subscribe(() => updateUrl()));

    unsubscribers.push(
      numberOfQuestions.subscribe((value: number) => {
        if (!value) {
          return;
        }

        updateUrl();
      }),
    );

    // Load round of streets once area is confirmed
    unsubscribers.push(
      isAreaConfirmed.subscribe(async (isConfirmed) => {
        if (!isConfirmed) {
          return;
        }

        const areaSelectionValue = svelteStore.get(areaSelection);

        loadRound({
          areaSelection: areaSelectionValue,
          difficulty: svelteStore.get(difficulty),
          isOrganizationUrl: svelteStore.get(isOrganizationUrl),
          numberOfQuestions: svelteStore.get(numberOfQuestions),
          radius: svelteStore.get(areaRadius),
        });

        ignoreError(() => {
          localStorage.setItem(
            "centerLatLng",
            JSON.stringify(svelteStore.get(areaCenter)),
          );
          setOrRemoveLocalStorageItem(
            "difficulty",
            svelteStore.get(difficulty),
          );
          setOrRemoveLocalStorageItem(
            "lastAreaSelectionAreaId",
            areaSelectionValue.areaId,
          );
          setOrRemoveLocalStorageItem("radius", svelteStore.get(areaRadius));
          setOrRemoveLocalStorageItem("shape", svelteStore.get(areaShape));
        });
      }),
    );

    // To be safe, complete the round when the final question is complete
    unsubscribers.push(
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
      }),
    );

    // const onRoundCompleted = throttle(async () => {
    const onRoundCompleted = async () => {
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

      if ($isOrganizationUrl) {
        if (!$userOrganization) {
          throw new Error("No userOrganization");
        }
        await api.postResource<Round>({
          attributes: {
            questionAmount: $round.questions.length,
            score: newPotentialBestScore,
          },
          relationships: {
            area: {
              data: $areaSelection.areaId
                ? {
                    id: $areaSelection.areaId,
                    type: "area",
                  }
                : null,
            },
            userorganization: {
              data: {
                id: $userOrganization.id,
                type: "userOrganization",
              },
            },
          },
          type: "round",
        });
      }
      // }, 300, { leading: true, trailing: false });
    };

    // Do some stuff when the round is updated
    unsubscribers.push(
      round.subscribe(async (value) => {
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
          await onRoundCompleted();
        }
      }),
    );

    // Persist personal best
    unsubscribers.push(
      deviceBestScore.subscribe((value) => {
        if (!value) {
          return;
        }
        ignoreError(() =>
          localStorage.setItem("deviceBestScore", value.toString()),
        );
      }),
    );

    return () => {
      for (const unsubscriber of unsubscribers) {
        unsubscriber();
      }
      resetGame();
    };
  });
</script>

<Page {internalRoute}>
  <main>
    {#if unhandledError}
      <FatalErrorDisplay error={unhandledError} />
    {:else}
      <!-- This is like a sidebar (but not really), I couldn't think of a better name -->
      <ContextPanel
        bind:areSettingsShown
        {resetGame}
      />
      <MapWrapper {areSettingsShown} />
      <p class="hide-accessibly"
        ><a href="#context-panel">Back to context panel</a></p
      >
      <HUD />
      <GeolocationRequester />
    {/if}
  </main>
</Page>

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
      "map-wrapper"
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
      grid-template-areas: "context-panel map-wrapper";
    }
  }
</style>

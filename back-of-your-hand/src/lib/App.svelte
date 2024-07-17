<script lang="ts">
  import { replaceState } from "$app/navigation";
  import debounce from "lodash/debounce";
  import { writable } from "svelte/store";

  import GeolocationRequester from "$lib/GeolocationRequester.svelte";
  import HUD from "$lib/HUD.svelte";
  import ContextPanel from "$lib/ContextPanel.svelte";
  import FatalErrorDisplay from "$lib/FatalErrorDisplay.svelte";
  import Map from "$lib/Map.svelte";
  import computeTotalScore from "$lib/utilities/computeTotalScore";
  import ignoreError from "$lib/utilities/ignoreError";
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
  } from "$lib/store";
  import loadRound from "$lib/utilities/loadRound";
  import type { LatLng } from "$lib/utilities/types";
  import trackEvent from "$lib/utilities/trackEvent";
  import { defineCustomElements } from "$lib/customElements";

  export let unhandledError = null;

  defineCustomElements();

  let areSettingsShown = writable(false);

  let lastSeenSeed: string | undefined;

  const updateUrl = debounce(
    () => {
      replaceState($gameUrl, {});
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

    // TODO
    if (value.seed !== lastSeenSeed) {
      updateUrl();
      lastSeenSeed = value.seed;
    }

    // Once the round ends, see if a new personal best was set
    if (value.status === "complete") {
      if (!$round) {
        throw new Error("round is falsy");
      }
      if (!$totalScore) {
        throw new Error("totalScore is falsy");
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
    <!-- <Map {areSettingsShown} /> -->
    <p class="hide-accessibly"
      ><a href="#context-panel">Back to context panel</a></p
    >
    <HUD />
    <GeolocationRequester />
  {/if}
</main>

<!-- Disable unused CSS selector warnings -->
<!-- eslint-disable svelte/valid-compile -->
<style global>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(html),
  :global(body) {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* This disables overscroll effects and prevents pull-to-refresh */
    overscroll-behavior-y: none;
    /* Disable zoom on iOS */
    touch-action: none;
  }

  :global(body) {
    background: #37003c;
    color: #333;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }

  & .leaflet-control-container .leaflet-top.leaflet-right {
    display: flex;
    flex-direction: column;
  }

  & .leaflet-bar a,
  & .leaflet-touch .leaflet-bar a {
    height: auto !important;
    width: auto !important;
    padding: 2px 10px !important;
  }

  & .leaflet-bar a,
  & .leaflet-bar button,
  & .leaflet-touch .leaflet-bar a {
    font-size: 1.2rem !important;
    font-weight: bold !important;
    text-align: left !important;
  }

  @media (min-width: 800px) {
    & .leaflet-bar a,
    & .leaflet-bar button,
    & .leaflet-touch .leaflet-right a {
      padding: 2px 7px 2px 10px !important;
      font-size: 1rem !important;
    }
  }

  & .leaflet-control-zoom-in,
  & .leaflet-control-zoom-out {
    user-select: none;
  }

  & .leaflet-control-zoom-in:active,
  & .leaflet-control-zoom-in:hover,
  & .leaflet-control-zoom-out:active,
  & .leaflet-control-zoom-out:hover {
    opacity: 1;
  }

  & .leaflet-control-zoom-in.leaflet-disabled,
  & .leaflet-control-zoom-out.leaflet-disabled {
    /* Just hide it rather than have an inaccessible colour contrast */
    display: none;
  }

  & .leaflet-locate-control {
    display: flex;
    background: #fff;
    cursor: pointer;
    /* Copied from leaflet zoom control */
    font:
      bold 18px "Lucida Console",
      Monaco,
      monospace;
  }

  & .leaflet-locate-control:hover {
    background: #f4f4f4;
  }

  & .leaflet-locate-control button,
  & .leaflet-locate-control button:active,
  & .leaflet-locate-control button:focus,
  & .leaflet-locate-control :hover {
    all: unset;
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    min-height: 34px;
    line-height: 30px;
    box-shadow: none;
    cursor: pointer;
  }

  @media (min-width: 800px) {
    & .leaflet-locate-control button,
    & .leaflet-locate-control button:active,
    & .leaflet-locate-control button:focus,
    & .leaflet-locate-control button:hover {
      padding-left: 5px !important;
    }
  }

  & .leaflet-locate-control svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
  }

  @media (min-width: 800px) {
    & .leaflet-locate-control svg {
      position: static;
      transform: none;
    }
  }

  & .leaflet-locate-control span {
    position: relative;
    top: 1px;
    margin-left: 6px;
  }

  & .leaflet-container a.leaflet-popup-close-button {
    /* For better colour contrast */
    color: #636363;
  }

  & .leaflet-tooltip {
    color: black;
    opacity: 0.8 !important;
  }

  & #map:not(.leaflet-safari) .leaflet-tile-container {
    filter: grayscale(0.8);
  }

  & #map:not(.leaflet-safari) .leaflet-tile {
    filter: saturate(8) hue-rotate(-10deg);
  }

  /* Safari filters are broken */
  & .leaflet-safari .leaflet-tile-pane .leaflet-layer {
    filter: grayscale(0.9);
  }
  & .leaflet-safari .leaflet-tile-container {
    filter: saturate(4) hue-rotate(-10deg);
  }

  :global(sharp-img) {
    position: relative;
    overflow: hidden;
  }

  :global(sharp-img img) {
    display: block;
    width: 100%;
    height: 100%;
  }

  :global(sharp-img .sharpen) {
    mix-blend-mode: hard-light;
  }

  :global(sharp-img .sharpen),
  :global(sharp-img .sharpen::before),
  :global(sharp-img .sharpen::after) {
    position: absolute;
    inset: 0;
  }

  :global(sharp-img .sharpen::before),
  :global(sharp-img .sharpen::after) {
    content: "";
    background-image: var(--sharp-img-css-background-image);
    background-repeat: no-repeat;
  }

  :global(sharp-img .sharpen::after) {
    filter: invert(1);
    opacity: 0.5;
    top: -1px;
    left: -1px;
  }

  :global(.hide-accessibly) {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  :global(ol),
  :global(ul) {
    list-style: none;
  }

  :global(fieldset) {
    all: unset;
  }

  :global(input) {
    accent-color: #df206f;
  }

  :global(.single-line-text-overflow) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(.slider) {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
    outline: none;
  }

  :global(.slider::-webkit-slider-thumb) {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 12px;
    background: #df206f;
    cursor: pointer;
  }

  :global(.slider::-webkit-slider-thumb:hover) {
    background: #d11563;
  }

  :global(.slider::-moz-range-thumb) {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 12px;
    background: #df206f;
    cursor: pointer;
  }

  :global(.slider::-moz-range-thumb:hover) {
    background: #d11563;
  }

  :global(button) {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 2rem;
    font-size: 1.2rem;
    background: #f0f0f0;
    background: rgba(240, 240, 240, 0.85);
    color: #000;
    text-shadow: 0 1px 2px white;
    cursor: pointer;
  }

  :global(button:hover),
  :global(button:active) {
    background: #d8d8d8;
  }

  :global(button:active) {
    position: relative;
    top: 1px;
    text-shadow: 0 0 2px white;
  }

  :global(button:focus) {
    outline: none;
  }

  :global(button:focus-visible) {
    box-shadow:
      0 0 0 3px #000,
      0 0 0 4px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.6s linear;
  }

  :global(.button--primary) {
    background: #df206f;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  :global(.button--primary:hover),
  :global(.button--primary:active) {
    background: #d11563;
  }

  :global(.button--primary:active),
  :global(.button--secondary:active) {
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
  }

  :global(.button--secondary) {
    background: #922b56;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  :global(.button--secondary:hover),
  :global(.button--secondary:active) {
    background: #a22257;
  }

  :global(button:disabled),
  :global(button:disabled:active),
  :global(button:disabled:hover) {
    background: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
  }

  :global(button:disabled:active) {
    position: relative;
    top: 1px;
  }

  :global(.button-group) {
    display: flex;
    justify-content: flex-end;
  }

  :global(.button-group button + button) {
    margin-left: 20px;
  }

  :global(.summary-street-tooltip) {
    max-width: 250px;
    display: block;
    color: black;
  }

  @media (min-width: 800px) {
    :global(.summary-street-tooltip) {
      font-size: 1.25rem;
    }
  }

  :global(.full-screen-display) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999999;

    overflow-y: auto;
    background: white;
  }

  :global(.full-screen-display__inner) {
    max-width: 600px;
    margin: 0 auto;
  }

  :global(.full-screen-display__inner > *) {
    margin-top: 1.5rem;
  }

  :global(.full-screen-display__innerbutton:first-of-type) {
    margin-right: 0.75rem;
  }

  :global(.full-screen-display__inner h2) {
    font-size: 1.2rem;
  }

  :global(.full-screen-display__innerpre) {
    padding: 0.5rem;
    overflow: auto;
    background: #f3f3f3;
    font-size: 0.7rem;
  }

  :global(.unstyled-link),
  :global(.unstyled-link:active),
  :global(.unstyled-link:focus),
  :global(.unstyled-link:hover) {
    color: inherit;
    cursor: default;
    text-decoration: none;
  }

  /*
  * ---------------------------------------------------------------------------------
  * Our global styles above, App component styles below (note: these are not scoped)
  * ---------------------------------------------------------------------------------
  */

  :global(main) {
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
    :global(main) {
      grid-template-columns: minmax(auto, 33%) 1fr;
      grid-template-rows: auto;
      grid-template-areas: "context-panel map";
    }
  }
</style>

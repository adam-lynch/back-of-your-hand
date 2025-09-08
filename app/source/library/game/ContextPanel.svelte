<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { writable } from "svelte/store";
  import {
    chosenPoint,
    currentQuestion,
    deviceBestScore,
    didOpenMultiplayerSessionUrl,
    difficulty,
    interactionVerb,
    isAreaConfirmed,
    isChosenPointConfirmed,
    multiplayerSessionJoinUrl,
    nextQuestion,
    numberOfQuestions,
    gameRound,
    seed,
    settingsLastOpenedAt,
    sidebarState,
  } from "../../utilities/store";
  import { isOrganizationUrl, organization } from "../../userData/store";
  import Summary from "./Summary.svelte";
  import trackEvent from "../../utilities/trackEvent";
  import { Difficulty } from "./types";
  import waitForAnyOngoingZoomsToEnd from "../../utilities/waitForAnyOngoingZoomsToEnd";
  import { onMount } from "svelte";
  import AreaSelection from "../AreaSelection.svelte";
  import Button from "../forms/Button.svelte";
  import combineClasses from "../utilities/combineClasses";
  import prettifyDistance from "../utilities/prettifyDistance";
  import makeClickHandlerIgnoreDoubleClicks from "../utilities/makeClickHandlerIgnoreDoubleClicks";

  export let areSettingsShown = writable(false);
  export let resetGame: () => void;

  const onNumberOfQuestionsUpdated = (event: Event) => {
    const amount = parseInt((event.target as HTMLInputElement).value);
    numberOfQuestions.set(amount);
  };

  const onChosenPointConfirmed = () => {
    isChosenPointConfirmed.set(true);
  };

  const onNextClicked = () => {
    // Activate next question
    gameRound.update((value) => {
      if (!value) {
        throw new Error("round is falsy");
      }
      return {
        ...value,
        questions: value.questions.map((question) => {
          if (question === $nextQuestion) {
            return {
              ...$nextQuestion,
              status: "ongoing",
            };
          }
          return question;
        }),
      };
    });
    // Reset chosen point / marker
    chosenPoint.set(null);
    isChosenPointConfirmed.set(false);
  };

  const onRestartClicked = () => {
    trackEvent({ name: "restart", title: "Restart" });
    resetGame();

    // It's required to set it to false and then true again
    isAreaConfirmed.set(true);
    return start();
  };

  const onSummaryRequested = () => {
    sidebarState.set("summary");
    trackEvent({ name: "view-summary", title: "View summary" });
  };

  const start = async () => {
    sidebarState.set("default");
    await waitForAnyOngoingZoomsToEnd();

    isAreaConfirmed.set(true);
    areSettingsShown.set(false);
  };

  const onStartClicked = async () => {
    await start();
    trackEvent({ name: "start", title: "Start" });
  };

  const onStartMultiplayerClicked = async () => {
    sidebarState.set("creating-multiplayer-session");
  };

  const copyMultiplayerUrl = () => {
    if (window.location.protocol === "http:") {
      alert(`Only supported on HTTPS (seed: ${$seed})`);
      return;
    }
    navigator.clipboard.writeText($multiplayerSessionJoinUrl);
  };

  const shareMultiplayerUrl = async () => {
    try {
      await navigator.share({
        text: "How well do you know your area? Join my game and test your knowledge by locating streets.",
        title: "Back Of Your Hand",
        url: $multiplayerSessionJoinUrl,
      });
    } catch (e) {
      // Ignore; navigator.share can throw when the share dialog is exited without sharing
    }
  };

  onMount(() => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      areSettingsShown.subscribe((value) => {
        if (!value) {
          return;
        }

        // 10 is arbitrary
        setTimeout(() => {
          (
            document.getElementById("start-call-to-action") as HTMLElement
          ).scrollIntoView(true);
        }, 10);
      }),
    );

    unsubscribers.push(
      isAreaConfirmed.subscribe(() => {
        areSettingsShown.set(false);
      }),
    );

    return () => {
      for (const unsubscriber of unsubscribers) {
        unsubscriber();
      }
    };
  });

  // Date.now()
  const timestampOfLastSettingsUpdate = $isOrganizationUrl
    ? 1728411648643
    : 1746269298034;
  const onSettingsButtonClicked = () => {
    areSettingsShown.update((previous) => !previous);
    const now = Date.now();
    settingsLastOpenedAt.set(now);
    localStorage.setItem("settingsLastOpenedAt", now.toString());
  };

  let formDifficultyGroup = $difficulty;
  function onDifficultyInput(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    trackEvent({
      name: `difficulty-updated-to-${event.currentTarget.value}`,
      title: `difficulty-updated-to-${event.currentTarget.value}`,
    });
    difficulty.set(event.currentTarget.value as Difficulty);
  }
</script>

<div class="context-panel-wrapper">
  <div
    class="context-panel"
    id="context-panel"
  >
    {#if $sidebarState === "summary"}
      <Summary
        {onRestartClicked}
        reset={resetGame}
      />
    {:else if $sidebarState === "creating-multiplayer-session"}
      <h2 class="hide-accessibly">Create multiplayer session</h2>
      <p
        >Your {$isOrganizationUrl ? "colleagues" : "friends"} can play along on their
        own devices, just give them the URL below:</p
      >

      <div class="multiplayer-link-wrapper">
        <span class="multiplayer-link-url-wrapper">
          <span class="multiplayer-link-url">{$multiplayerSessionJoinUrl}</span>
        </span>
        <div class="multiplayer-link-buttons">
          <Button
            class="multiplayer-link-button"
            on:click={copyMultiplayerUrl}
            size="small"
            variant="secondary"
          >
            Copy
          </Button>
          {#if "share" in navigator}
            <Button
              class="multiplayer-link-button"
              on:click={shareMultiplayerUrl}
              size="small"
            >
              Share
            </Button>
          {/if}
        </div>
      </div>

      <p>They will be given the same set of streets to find as you.</p>

      <div
        class="call-to-action"
        id="start-call-to-action"
      >
        <Button
          class="button--primary"
          on:click={makeClickHandlerIgnoreDoubleClicks(onStartClicked)}
          variant="primary"
        >
          Start
        </Button>
        <Button on:click={resetGame}>Back</Button>
      </div>
    {:else if $gameRound?.status && ["ongoing", "completed"].includes($gameRound.status)}
      <!-- Just to be safe-->
      {#if $currentQuestion}
        <p
          ><span class="question-index"
            >{$currentQuestion.index + 1} / {$gameRound.questions.length}</span
          > Find the following:</p
        >
        <div class="street-sign-wrapper">
          <div
            class="street-sign {$currentQuestion.target
              .alternativeNameLanguageCode === 'ga'
              ? `street-sign--alternative-name-on-top`
              : ''}"
          >
            <span class="street-name">{$currentQuestion.target.name}</span>
            {#if $currentQuestion.target.alternativeName}
              <span class="street-name-alternative">
                <span class="hide-accessibly">(</span>{$currentQuestion.target
                  .alternativeName}<span class="hide-accessibly">)</span>
              </span>
            {/if}
          </div>
        </div>

        {#if $currentQuestion.status === "complete" && $currentQuestion.distance}
          <div>
            <h2>Result</h2>
            <p>Distance: {prettifyDistance($currentQuestion.distance.amount)}</p
            >
            <p>Score: {$currentQuestion.score}%</p>
            <p class="subtext">Feel free to zoom in and explore</p>
          </div>
        {/if}
      {/if}

      <div class="call-to-action">
        {#if $currentQuestion && $currentQuestion.status === "ongoing"}
          <Button
            class="button--primary"
            disabled={!$chosenPoint}
            on:click={onChosenPointConfirmed}
            variant="primary"
          >
            Confirm
          </Button>
          <p class="subtext"
            >{$interactionVerb} the
            <a
              href="#map-wrapper"
              class="unstyled-link">map</a
            > to drop a pin on a street</p
          >
        {:else if $chosenPoint}
          {#if $nextQuestion}
            <Button
              class="button--primary"
              on:click={onNextClicked}
              variant="primary"
            >
              Next
            </Button>
          {:else}
            <Button
              class="button--primary"
              on:click={onRestartClicked}
              variant="primary"
            >
              Start a new round
            </Button>

            <Button
              class="button--secondary"
              on:click={onSummaryRequested}
              variant="secondary"
            >
              View summary
            </Button>

            <Button
              on:click={resetGame}
              variant="tertiary">Reset</Button
            >
          {/if}
        {/if}
      </div>
    {:else if !$gameRound}
      <!-- No summary shown, no active round -->
      <p>
        How well do you know your area? Test your knowledge by locating streets.
      </p>

      <p class="hide-accessibly"
        >To select a different area, you can zoom out and {$interactionVerb.toLowerCase()}
        anywhere on the map</p
      >

      {#if $deviceBestScore}
        <p class="subtext">Personal best score: {$deviceBestScore}%</p>
      {/if}

      <div
        class="call-to-action"
        id="start-call-to-action"
      >
        {#if $didOpenMultiplayerSessionUrl}
          <Button
            class="button--primary"
            on:click={onStartClicked}
            variant="primary"
          >
            Play (multiplayer mode)
          </Button>
          <Button on:click={resetGame}>Reset</Button>
        {:else}
          <Button
            class="button--primary"
            on:click={onStartClicked}
            variant="primary"
          >
            Play solo
          </Button>
          <Button
            class="button--secondary"
            on:click={onStartMultiplayerClicked}
            variant="secondary"
          >
            Multiplayer
          </Button>
          <Button
            class={combineClasses(
              "settings-button",
              !$settingsLastOpenedAt ||
                $settingsLastOpenedAt < timestampOfLastSettingsUpdate
                ? "hasUnseenSetting"
                : "",
            )}
            on:click={onSettingsButtonClicked}
          >
            Configure {#if $areSettingsShown}<span>&times;</span>{/if}
          </Button>
        {/if}
      </div>

      {#if $areSettingsShown}
        <div class="settings">
          <div class="wideSetting">
            <p class="radioButtonGroupTitle">Difficulty</p>
            <fieldset class="difficultyRadioButtonGroup">
              <label
                class:selectedRadioButtonLabel={formDifficultyGroup ===
                  Difficulty.Tourist}
              >
                <input
                  bind:group={formDifficultyGroup}
                  on:input={onDifficultyInput}
                  type="radio"
                  value={Difficulty.Tourist}
                />
                <span class="difficultyLabelTextWrapper">
                  <span class="difficultyLabelMainText">Tourist</span>
                  <span class="difficultyLabelDescription"
                    >Main streets and landmarks only</span
                  >
                </span>
              </label>
              <label
                class:selectedRadioButtonLabel={formDifficultyGroup ===
                  Difficulty.Resident}
              >
                <input
                  bind:group={formDifficultyGroup}
                  on:input={onDifficultyInput}
                  type="radio"
                  value={Difficulty.Resident}
                />
                <span class="difficultyLabelTextWrapper">
                  <span class="difficultyLabelMainText">Resident</span>
                  <span class="difficultyLabelDescription"
                    >"Tourist" plus some smaller streets</span
                  >
                </span>
              </label>
              <label
                class:selectedRadioButtonLabel={formDifficultyGroup ===
                  Difficulty.TaxiDriver}
              >
                <input
                  bind:group={formDifficultyGroup}
                  on:input={onDifficultyInput}
                  type="radio"
                  value={Difficulty.TaxiDriver}
                />
                <span class="difficultyLabelTextWrapper">
                  <span class="difficultyLabelMainText">Taxi driver</span>
                  <span class="difficultyLabelDescription"
                    >Every nook and cranny</span
                  >
                </span>
              </label>
            </fieldset>
          </div>

          <AreaSelection />

          <div>
            <label for="numberOfQuestionsInput">Questions per round</label>
            <div class="subtext">{$numberOfQuestions}</div>
            <input
              type="range"
              min="5"
              max={$organization?.attributes.questionsPerRoundLimit ?? 50}
              value={$numberOfQuestions}
              step="5"
              class="slider"
              id="numberOfQuestionsInput"
              on:input={onNumberOfQuestionsUpdated}
            />
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .context-panel-wrapper {
    display: flex;
    flex-direction: column;
    grid-area: context-panel;
    padding: 1rem;
    max-height: 68vh;
    overflow-x: hidden;
    z-index: 999999;
    background: #37003c;
    box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.3);
    color: #e6e4e4;

    scrollbar-color: rgba(255, 255, 255, 0.6) transparent;
    scrollbar-width: thin;
  }

  .context-panel-wrapper::-webkit-scrollbar {
    height: 14px;
    width: 14px;
  }

  .context-panel-wrapper::-webkit-scrollbar-track {
    opacity: 0;
  }

  .context-panel-wrapper::-webkit-scrollbar-thumb {
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.6);
    background-clip: padding-box;
    border: 5px solid rgba(0, 0, 0, 0);
  }

  .context-panel-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }

  .context-panel {
    min-width: 40vw;
    display: flex;
    flex-direction: column;
  }

  /* When context-panel is on the side */
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
    .context-panel-wrapper {
      max-height: none;
    }
    .context-panel {
      min-width: auto;
    }
  }

  @media (min-width: 600px) {
    .context-panel {
      max-width: 100%;
      margin: 0 auto;
    }
  }

  @media (min-width: 1200px) {
    .context-panel-wrapper {
      padding: 1.5rem;
      box-shadow: 2px 0 2px rgba(0, 0, 0, 0.3);
    }
  }

  .context-panel > * + * {
    margin-top: 1.5rem;
    line-height: 1.5;
  }

  .context-panel P {
    line-height: 1.4rem;
  }

  .call-to-action {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  a:focus {
    outline: none;
  }

  a:focus-visible {
    /* Better contrast */
    box-shadow:
      0 0 0 3px #ff0,
      0 0 0 4px rgba(0, 0, 0, 0.2);
  }

  .multiplayer-link-wrapper {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    user-select: none;
  }

  .multiplayer-link-url-wrapper,
  .multiplayer-link-url {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .multiplayer-link-url {
    flex: 1;
    display: block;
    font-size: 0.8rem;
    opacity: 0.8;
    pointer-events: none;
  }

  .multiplayer-link-buttons {
    display: flex;
    flex-direction: row;
    margin-left: 0.5rem;
    gap: 0.5rem;
  }

  .multiplayer-link-button {
    flex: 1;
    font-size: 0.9rem;
  }

  .multiplayer-link-button:first-child {
    margin-right: 0.5rem;
  }

  .settings-button {
    position: relative;
  }

  .settings-button span {
    position: relative;
    top: 1px;
    opacity: 0.5;
    margin-left: 0.25rem;
    font-size: 1.3rem;
    line-height: 0;
    text-shadow: none;
  }

  :global(.settings-button.hasUnseenSetting::before) {
    content: " ";
    position: absolute;
    top: -4px;
    right: -4px;
    background: red;
    border-radius: 10px;
    text-shadow: none;
    padding: 7px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    border: 1px solid #37033c;
  }

  :global(.subtext) {
    display: block;
    min-width: 100%;
    font-size: 0.7rem;
    line-height: 1.2;
    margin: 0.5rem 0 0 0;
    color: rgba(255, 255, 255, 0.5);
  }

  .settings {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2rem;
  }

  :global(.settings > *:not(.wideSetting)) {
    flex: 1;
    flex-basis: 45%;
    justify-content: space-between;
  }

  :global(.wideSetting) {
    min-width: 100%;
  }

  .difficultyRadioButtonGroup {
    align-items: center;
  }

  .difficultyRadioButtonGroup label {
    display: flex;
    flex-direction: row;
    cursor: pointer;
  }

  .difficultyRadioButtonGroup label:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }

  .difficultyLabelTextWrapper {
    display: flex;
    flex-direction: column;
    margin-left: 0.5rem;
    color: #7e6180;
  }

  .difficultyLabelMainText {
    padding-right: 1.5rem;
    font-size: 14px;
  }

  .difficultyLabelDescription {
    display: block;
    font-size: 12px;
    opacity: 0.75;
  }

  .difficultyRadioButtonGroup
    label:not(.selectedRadioButtonLabel):hover
    .difficultyLabelTextWrapper {
    color: #947d95;
  }

  .selectedRadioButtonLabel .difficultyLabelTextWrapper {
    color: white;
  }

  .radioButtonGroupTitle {
    margin-bottom: 0.5rem;
  }

  .street-sign-wrapper {
    margin-top: 1rem;
  }

  .street-sign {
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: max-content;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    border: 4px solid black;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    background: #fefefe;
    border-radius: 5px;
    color: black;
    font-weight: bold;
    text-align: center;
    line-height: 1;
  }

  .street-sign span {
    display: block;
  }

  .street-name {
    letter-spacing: 0.1rem;
    text-transform: uppercase;
  }

  .street-name-alternative {
    font-style: italic;
    font-size: 0.9rem;
  }

  .street-sign--alternative-name-on-top .street-name {
    order: 1;
  }

  .street-sign--alternative-name-on-top .street-name-alternative {
    order: 0;
  }

  .question-index {
    margin-right: 0.25rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .context-panel :global(.select-input) {
    background-color: rgba(255, 255, 255, 0.15);
  }
</style>

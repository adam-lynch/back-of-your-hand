<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { orderedQuestions, round, totalScore } from "./store";
  import computeTotalScore from "../utilities/computeTotalScore";
  export let onRestartClicked: () => void;
  export let reset: () => void;
</script>

<div class="summary">
  <h2 class="hide-accessibly">Summary</h2>
  {#if $round && $totalScore}
    <p class="points-total">
      <span>Overall score: {computeTotalScore($totalScore, $round)}%</span>
      {#if $round.didSetNewDeviceBestScore}
        <span class="tada">New personal best!</span>
      {/if}
    </p>
  {/if}

  <ol class="results-list">
    {#each $orderedQuestions ?? [] as question}
      <li>
        <span class="results-list__street-name single-line-text-overflow">
          {question.target.name}
          {#if question.target.alternativeName}
            ({question.target.alternativeName})
          {/if}
        </span>
        <span class="hide-accessibly">(Score: </span>
        <span>{question.score}%</span>
        <span class="hide-accessibly">)</span>
      </li>
    {/each}
  </ol>

  <div class="call-to-action">
    <button
      class="button--primary"
      on:click={onRestartClicked}
    >
      Start a new round
    </button>

    <button on:click={reset}> Reset </button>
  </div>
</div>

<style>
  .summary > * {
    margin-top: 1.5rem;
    line-height: 1.5;
  }

  .results-list {
    margin-top: 1rem;
  }

  .results-list li {
    display: flex;
    flex-direction: row;
  }

  .results-list__street-name {
    flex: 1;
    padding-right: 1rem;
  }

  .call-to-action {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }

  .points-total {
    display: flex;
    flex-wrap: wrap;
  }

  .points-total span:first-of-type {
    margin-right: 1rem;
  }

  .tada {
    padding: 0 5px;
    border-radius: 5px;
    color: black;
    background: white;
    background: linear-gradient(
      135deg,
      white 30%,
      #ff0 50%,
      #ffe300,
      white 70%
    );
    background-size: 400% 400%;
    animation: Shimmer 1s ease infinite reverse;
  }

  @media (prefers-reduced-motion) {
    .tada {
      animation: none;
    }
  }

  @keyframes Shimmer {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
</style>

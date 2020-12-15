<script lang="ts">
  import { orderedQuestions, round, totalScore } from './store';
  export let onRestartClicked: () => void;
</script>

<div class="summary">
  <h2 class="hide-accessibly">Summary</h2>
  <p class="points-total">
    <span>Total points: {$totalScore} / {$round.questions.length * 100}</span>
    {#if $round.didSetNewDeviceBestScore}
      <span class="tada">New personal best!</span>
    {/if}
  </p>

  <ol class="results-list">
    {#each $orderedQuestions as question}
      <li>
        <span class="results-list__street-name single-line-text-overflow">
          {question.street.name} 
          {#if question.street.alternativeName}
            ({question.street.alternativeName})
          {/if}
        </span>
        <span class="hide-accessibly">(Score: </span>
        <span>{question.score}</span>
        <span class="hide-accessibly">)</span>
      </li>
    {/each}
  </ol>

  <div class="call-to-action">
    <button
      class="button--primary"
      on:click={onRestartClicked}>
      Start a new round
    </button>
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
    background: linear-gradient(135deg, white 30%, #ff0 50%, #ffe300, white 70%);
    background-size: 400% 400%;
    animation: Shimmer 1s ease infinite reverse;
  }

  @media (prefers-reduced-motion) {
    .tada {
      animation: none;
    }
  }

  @keyframes Shimmer {
    0% { background-position: 0% 50% }
    100% { background-position: 100% 50% }
  }
</style>
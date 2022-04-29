<script lang="ts">
  import { areaRadius, chosenPoint, currentQuestion, deviceBestScore, interactionVerb, isAreaConfirmed, isChosenPointConfirmed, isSummaryShown, nextQuestion, round } from './store';
  import Summary from './Summary.svelte';
  import trackEvent from './utilities/trackEvent';
  import waitForAnyOngoingZoomsToEnd from './utilities/waitForAnyOngoingZoomsToEnd';

  const onRadiusChanged = () => {
    const radius = parseInt((document.getElementById("radiusSlider") as HTMLInputElement).value);
    areaRadius.update(() => radius);
  };

  const onChosenPointConfirmed = () => {
    isChosenPointConfirmed.set(true);
  };

  const onNextClicked = () => {
    // Activate next question
    round.update((value) => {
      return {
        ...value,
        questions: value.questions.map((question) => {
          if(question === $nextQuestion) {
            return {
              ...$nextQuestion,
              status: "ongoing"
            }
          }
          return question;
        })
      }
    });
    // Reset chosen point / marker
    chosenPoint.set(null);
    isChosenPointConfirmed.set(false);
  }

  const onRestartClicked = () => {
    // Reset a lot of stuff
    chosenPoint.set(null);
    isAreaConfirmed.set(false);
    isChosenPointConfirmed.set(false);
    isSummaryShown.set(false);
    round.set(null);
    trackEvent({ name: "restart", title: "Restart" });
  }

  const onSummaryRequested = () => {
    isSummaryShown.set(true);
    trackEvent({ name: "view-summary", title: "View summary" });
  };

  const onStartClicked = async () => {
    await waitForAnyOngoingZoomsToEnd();

    isAreaConfirmed.set(true);
    trackEvent({ name: "start", title: "Start" });
  };
</script>

<div class="context-panel-wrapper">
  <div class="context-panel" id="context-panel">
    <h1>
      <svg viewBox="-10 -8 20 16" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF"><path d="M-4.551 3.954a.27.27 0 11-.146-.52c.21-.06.443-.148.718-.273a4.319 4.319 0 01.295-.112V-7.88L-9.9-5.604V8.039l6.216-2.275V3.6c0-.01-.043.04-.073.054a5.611 5.611 0 01-.794.3zm-3.307-5.518c-.147.046-.289.094-.424.14l-.346.114a.271.271 0 01-.34-.176.27.27 0 01.175-.34c.107-.033.22-.071.34-.111.137-.046.282-.095.431-.142a.27.27 0 11.164.515zm.965-.53a.27.27 0 01.248-.292c.33-.026.642-.001.904.08a.27.27 0 01-.159.516 1.927 1.927 0 00-.702-.057.27.27 0 01-.291-.247zm1.185 5.823a.27.27 0 01-.382.011c-.207-.195-.354-.481-.438-.85A.27.27 0 01-6 2.77c.059.263.154.457.281.577a.27.27 0 01.011.382zm.414-2.708l-.064.094c-.134.197-.26.383-.37.57a.27.27 0 01-.37.097.27.27 0 01-.097-.37c.12-.203.257-.406.39-.601l.064-.093a.27.27 0 11.447.303zm.332-1.081a.27.27 0 01-.195-.329c.027-.107.04-.21.04-.31 0-.115-.017-.225-.054-.337a.27.27 0 01.514-.169c.054.165.082.335.082.506 0 .145-.02.294-.058.444a.27.27 0 01-.329.195zm9.116-5.544V2.24c0 .036.106.07.154.107a.27.27 0 01.049.378c-.05.065-.203.099-.203.104v5.209L10.1 5.764V-7.88L4.154-5.604zm1.995 9.56a.27.27 0 01-.37.094 10.622 10.622 0 01-.696-.458.27.27 0 01-.064-.377.27.27 0 01.377-.064 9.847 9.847 0 00.66.434c.128.077.17.243.093.371zM6.44-1.04a.27.27 0 01-.232-.409l.676-1.14-1.416-.603a.27.27 0 11.212-.497l1.481.631.65-1.096a.27.27 0 11.465.275l-.613 1.035 1.067.455a.27.27 0 11-.212.497l-1.133-.483-.713 1.202a.268.268 0 01-.232.133zm1.593 5.612c-.164.047-.33.077-.515.07a2.235 2.235 0 01-.41-.04.27.27 0 01.1-.531c.108.02.207.027.313.03.127 0 .25-.016.365-.049a.27.27 0 01.147.52zm.134-4.884a.27.27 0 01-.373-.082 11.902 11.902 0 00-.451-.654.27.27 0 11.434-.321 12.518 12.518 0 01.472.683.27.27 0 01-.082.374zm.27 1.068a.27.27 0 01.488-.23 7.17 7.17 0 01.316.782.27.27 0 01-.513.17 6.594 6.594 0 00-.292-.722zm.808 2.865a.27.27 0 11-.483-.24c.097-.197.153-.424.166-.675a.27.27 0 11.54.028 2.233 2.233 0 01-.223.887zM3.244 1.928c.034-.048.1-.077.1-.095v-7.437L-2.874-7.88V2.706c0-.064.173-.12.237-.156.158-.088.375-.179.535-.27l.254-.127c.13-.073.309-.027.382.103s.034.295-.096.368l-.222.127c-.162.092-.322.183-.482.272a.264.264 0 01-.13.034c-.095 0-.297-.05-.347-.14-.011-.02-.131-.116-.131-.138v2.986l6.216 2.274V2.355c0-.016-.028-.034-.051-.05-.122-.086-.134-.255-.048-.377zm-2.9-.255a8.46 8.46 0 00-.719.319.27.27 0 01-.361-.123.27.27 0 01.123-.362 9.148 9.148 0 01.764-.339.272.272 0 01.35.156.27.27 0 01-.157.35zm2.242-.17a.27.27 0 01-.357.138 2.285 2.285 0 00-.693-.2.27.27 0 01-.242-.296.272.272 0 01.297-.242c.267.027.548.107.857.244a.27.27 0 01.138.357zm-5.995 1.71v.386a.268.268 0 00.06-.303.274.274 0 00-.06-.084zm.536-.434v-.073.073z"/><path d="M7.777-1.37a.27.27 0 10-.434.322 11.902 11.902 0 01.45.654.27.27 0 10.456-.292 12.627 12.627 0 00-.472-.683z"/></g></svg>
      <svg viewBox="-626.081 0 1252.162 100" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF"><path d="M-604.619 83.515c-1.14 0-1.71-.57-1.71-1.711V58.32c0-1.14.57-1.71 1.71-1.71h17.107c3.525 0 6.066.674 7.62 2.021 1.556 1.348 2.334 3.63 2.334 6.843v9.02c0 3.215-.752 5.522-2.255 6.921-1.504 1.4-3.966 2.1-7.388 2.1zm0-42.924c-1.14 0-1.71-.57-1.71-1.71V18.195c0-1.14.57-1.71 1.71-1.71h16.019c3.317 0 5.728.7 7.231 2.099 1.504 1.4 2.255 3.706 2.255 6.92v6.066c0 3.214-.777 5.52-2.332 6.92-1.556 1.4-3.992 2.1-7.31 2.1zm-21.462 56.143c0 2.177 1.089 3.266 3.266 3.266h38.88c8.087 0 14.36-2.177 18.818-6.532 4.459-4.354 6.688-10.575 6.688-18.662v-9.332c0-5.08-1.244-8.994-3.733-11.741-2.488-2.748-5.806-4.433-9.953-5.055 8.19-2.592 12.286-8.294 12.286-17.107v-6.377c0-8.087-2.23-14.308-6.687-18.662C-570.975 2.177-577.3 0-585.49 0h-37.325c-2.177 0-3.266 1.089-3.266 3.266zM-530.762 100c1.037 0 1.789-.233 2.255-.7.467-.466.804-1.322 1.011-2.566l4.355-17.107h30.327l4.354 17.107c.207 1.244.518 2.1.933 2.566.415.467 1.193.7 2.333.7h14.93c1.866 0 2.488-1.089 1.866-3.266L-492.97 3.266C-493.488 1.089-495.044 0-497.636 0h-20.684c-2.385 0-3.94 1.089-4.666 3.266l-24.572 93.468c-.622 2.177 0 3.266 1.866 3.266zm22.55-81.182h.623l11.198 44.946h-23.018zM-414.914 100c8.087 0 14.386-2.203 18.896-6.61 4.51-4.406 6.765-10.653 6.765-18.74v-7.31c0-2.28-1.14-3.42-3.421-3.42h-13.064c-2.177 0-3.266 1.14-3.266 3.42v6.377c0 3.318-.7 5.676-2.1 7.076-1.399 1.4-3.758 2.1-7.076 2.1h-10.575c-3.214 0-5.521-.7-6.92-2.1-1.4-1.4-2.1-3.758-2.1-7.076V26.283c0-3.318.7-5.676 2.1-7.076 1.399-1.4 3.706-2.1 6.92-2.1h10.575c3.318 0 5.677.7 7.077 2.1 1.4 1.4 2.1 3.758 2.1 7.076v6.376c0 2.281 1.088 3.422 3.265 3.422h13.064c2.28 0 3.421-1.14 3.421-3.422v-7.31c0-8.086-2.255-14.333-6.765-18.74C-400.528 2.204-406.827 0-414.914 0h-16.951c-8.191 0-14.516 2.177-18.974 6.532-4.458 4.354-6.687 10.627-6.687 18.818v49.3c0 8.19 2.229 14.464 6.687 18.818 4.458 4.355 10.783 6.532 18.974 6.532zM-357.233 100c2.178 0 3.266-1.089 3.266-3.266V70.14l9.798-11.509 23.795 38.103c1.244 2.177 3.68 3.266 7.31 3.266h11.352c1.452 0 2.411-.337 2.878-1.01.466-.675.337-1.634-.39-2.878l-32.97-51.633 29.55-40.902c.829-1.037 1.114-1.892.855-2.566-.26-.674-.96-1.011-2.1-1.011h-15.24c-2.697 0-4.718 1.089-6.066 3.266l-23.64 34.681c-2.384 3.94-3.991 7.154-4.82 9.642h-.312V3.266c0-2.177-1.088-3.266-3.266-3.266h-13.219c-2.177 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.089 3.266 3.266 3.266zM-228.336 82.893c-3.318 0-5.65-.7-6.998-2.1-1.348-1.4-2.022-3.758-2.022-7.076V26.283c0-3.318.674-5.676 2.022-7.076 1.347-1.4 3.68-2.1 6.998-2.1h11.042c3.318 0 5.677.7 7.076 2.1 1.4 1.4 2.1 3.758 2.1 7.076v47.434c0 3.318-.7 5.676-2.1 7.076-1.4 1.4-3.758 2.1-7.076 2.1zM-214.028 100c8.19 0 14.515-2.177 18.974-6.532 4.458-4.354 6.687-10.627 6.687-18.818v-49.3c0-8.19-2.23-14.464-6.687-18.818C-199.513 2.177-205.837 0-214.028 0h-17.418c-8.191 0-14.516 2.177-18.974 6.532-4.458 4.354-6.687 10.627-6.687 18.818v49.3c0 8.19 2.229 14.464 6.687 18.818 4.458 4.355 10.783 6.532 18.974 6.532zM-154.634 100c2.177 0 3.266-1.089 3.266-3.266V63.608c0-1.14.622-1.71 1.866-1.71h26.594c2.177 0 3.266-1.141 3.266-3.422v-10.42c0-2.177-1.089-3.266-3.266-3.266h-26.594c-1.244 0-1.866-.622-1.866-1.866V18.818c0-1.14.622-1.71 1.866-1.71h31.26c2.073 0 3.11-1.09 3.11-3.267V3.266c0-2.177-1.037-3.266-3.11-3.266h-49.611c-2.178 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.088 3.266 3.266 3.266zM-33.05 100c2.178 0 3.267-1.089 3.267-3.266V63.453L-1.323 3.42c.519-1.036.545-1.866.078-2.488C-1.712.311-2.463 0-3.5 0h-16.485c-1.763 0-3.007 1.089-3.733 3.266l-15.24 37.792h-1.09L-55.6 3.266C-56.43 1.089-57.673 0-59.332 0h-16.485c-.933 0-1.633.337-2.1 1.01-.466.675-.492 1.478-.078 2.411l28.46 60.032v33.281c0 2.177 1.09 3.266 3.267 3.266zM36.454 82.893c-3.318 0-5.65-.7-6.999-2.1-1.348-1.4-2.022-3.758-2.022-7.076V26.283c0-3.318.674-5.676 2.022-7.076 1.348-1.4 3.68-2.1 6.999-2.1h11.042c3.317 0 5.676.7 7.076 2.1 1.4 1.4 2.1 3.758 2.1 7.076v47.434c0 3.318-.7 5.676-2.1 7.076-1.4 1.4-3.759 2.1-7.076 2.1zM50.762 100c8.19 0 14.515-2.177 18.973-6.532 4.458-4.354 6.688-10.627 6.688-18.818v-49.3c0-8.19-2.23-14.464-6.688-18.818C65.277 2.177 58.952 0 50.762 0H33.343c-8.19 0-14.515 2.177-18.973 6.532C9.91 10.886 7.682 17.159 7.682 25.35v49.3c0 8.19 2.23 14.464 6.688 18.818C18.828 97.823 25.152 100 33.343 100zM144.837 0c-2.178 0-3.266 1.089-3.266 3.266v70.451c0 3.318-.7 5.676-2.1 7.076-1.4 1.4-3.758 2.1-7.076 2.1h-10.73c-3.215 0-5.522-.7-6.922-2.1-1.4-1.4-2.1-3.758-2.1-7.076V3.266c0-2.177-1.088-3.266-3.265-3.266h-13.22c-2.177 0-3.265 1.089-3.265 3.266V74.65c0 8.19 2.229 14.464 6.687 18.818 4.458 4.355 10.783 6.532 18.974 6.532h17.107c8.087 0 14.386-2.203 18.896-6.61 4.51-4.406 6.765-10.653 6.765-18.74V3.11c0-2.073-1.14-3.11-3.422-3.11zM195.832 100c2.178 0 3.266-1.089 3.266-3.266V64.852c0-1.14.622-1.71 1.867-1.71h10.42l15.552 33.592c.518 1.348 1.192 2.23 2.021 2.644.83.415 2.178.622 4.044.622h12.597c2.696 0 3.577-1.244 2.644-3.733l-16.64-34.68v-.623c9.227-3.836 13.84-11.612 13.84-23.328v-12.13c0-8.088-2.28-14.36-6.842-18.819C234.039 2.23 227.714 0 219.627 0h-37.014c-2.177 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.089 3.266 3.266 3.266zm4.977-52.722c-1.14 0-1.71-.57-1.71-1.71v-26.75c0-1.14.57-1.71 1.71-1.71h15.241c3.318 0 5.754.725 7.31 2.177 1.555 1.451 2.333 3.784 2.333 6.998v12.13c0 3.111-.778 5.366-2.333 6.766-1.556 1.4-3.992 2.1-7.31 2.1zM312.285 100c2.178 0 3.266-1.089 3.266-3.266V60.342c0-1.14.622-1.71 1.866-1.71h26.284c1.14 0 1.71.57 1.71 1.71v36.392c0 2.177 1.089 3.266 3.266 3.266h13.22c2.177 0 3.265-1.089 3.265-3.266V3.266c0-2.177-1.088-3.266-3.266-3.266h-13.219c-2.177 0-3.266 1.089-3.266 3.266v36.547c0 1.14-.57 1.711-1.71 1.711h-26.284c-1.244 0-1.866-.57-1.866-1.71V3.265c0-2.177-1.088-3.266-3.266-3.266h-13.219c-2.177 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.089 3.266 3.266 3.266zM394.385 100c1.037 0 1.789-.233 2.255-.7.467-.466.804-1.322 1.011-2.566l4.355-17.107h30.326l4.355 17.107c.207 1.244.518 2.1.933 2.566.415.467 1.192.7 2.333.7h14.93c1.866 0 2.488-1.089 1.866-3.266L432.177 3.266C431.658 1.089 430.103 0 427.51 0h-20.684c-2.385 0-3.94 1.089-4.666 3.266L377.59 96.734c-.622 2.177 0 3.266 1.866 3.266zm22.55-81.182h.623l11.197 44.946h-23.017zM485.35 100c2.177 0 3.266-1.089 3.266-3.266V39.036h.622l31.104 57.854c1.037 2.073 2.696 3.11 4.977 3.11h11.353c2.177 0 3.266-1.089 3.266-3.266V3.266c0-2.177-1.089-3.266-3.266-3.266h-12.908c-2.178 0-3.266 1.089-3.266 3.266V61.12h-.622L488.46 2.177C487.735.726 486.283 0 484.106 0h-11.664c-2.178 0-3.266 1.089-3.266 3.266v93.468c0 2.177 1.088 3.266 3.266 3.266zM580.203 82.893c-1.14 0-1.711-.57-1.711-1.711V18.818c0-1.14.57-1.71 1.71-1.71h16.952c3.318 0 5.677.7 7.077 2.099 1.4 1.4 2.1 3.758 2.1 7.076v47.434c0 3.318-.7 5.676-2.1 7.076-1.4 1.4-3.759 2.1-7.077 2.1zM558.74 96.734c0 2.177 1.088 3.266 3.266 3.266h38.413c8.087 0 14.386-2.203 18.896-6.61 4.51-4.406 6.765-10.653 6.765-18.74v-49.3c0-8.087-2.255-14.334-6.765-18.74C614.806 2.203 608.507 0 600.42 0h-38.413c-2.178 0-3.266 1.089-3.266 3.266z"/></g></svg>
      <span class="hide-accessibly">Back of your hand</span>
    </h1>

    {#if $isSummaryShown}
      <Summary onRestartClicked={onRestartClicked} />
    {:else if ["ongoing", "complete"].includes($round && $round.status)}

      <!-- Just to be safe-->
      {#if $currentQuestion}
        <p><span class="question-index">{$currentQuestion.index+1} / {$round.questions.length}</span> Find the following:</p>
        <div class="street-sign-wrapper">
          <div class="street-sign {$currentQuestion.street.alternativeNameLanguageCode === "ga" ? `street-sign--alternative-name-on-top` : ''}">
            <span class="street-name">{$currentQuestion.street.name}</span>
            {#if $currentQuestion.street.alternativeName}
              <span class="street-name-alternative">
                <span class="hide-accessibly">(</span>{$currentQuestion.street.alternativeName}<span class="hide-accessibly">)</span>
              </span>
            {/if}
          </div>
        </div>

        {#if $currentQuestion.status === "complete"}
          <div>
            <h2>Result</h2>
            <p>Distance: {Math.round($currentQuestion.distance.amount).toLocaleString()} {$currentQuestion.distance.unit}</p>
            <p>Score: {$currentQuestion.score}%</p>
            <p class="subtext">Feel free to zoom in and explore</p>
          </div>
        {/if}
      {/if}

      <div class="call-to-action">
        {#if $currentQuestion && $currentQuestion.status === "ongoing"}
          <button
            class="button--primary"
            disabled={!$chosenPoint}
            on:click={onChosenPointConfirmed}>
            Confirm
          </button>
          <p class="subtext">{$interactionVerb} the <a href="#map" class="unstyled-link">map</a> to drop a pin on a street</p>

        {:else if $chosenPoint}

          {#if $nextQuestion}
            <button
              class="button--primary"
              on:click={onNextClicked}>
              Next
            </button>
          {:else}
            <button
              class="button--primary"
              on:click={onRestartClicked}>
              Start a new round
            </button>

            <button
              on:click={onSummaryRequested}>
              View summary
            </button>
          {/if}

        {/if}
      </div>

    {:else if !$round} <!-- No summary shown, no active round -->

      <p>
        How well do you know your area? Test your knowledge by locating streets.
      </p>

      <p class="hide-accessibly">To select a different area, you can zoom out and {$interactionVerb.toLowerCase()} anywhere on the map</p>

      {#if $deviceBestScore}
        <p class="subtext">Personal best score: {$deviceBestScore}%</p>
      {/if}

      <div>
        <label for="radiusSlider">Radius of area</label>
        <div class="subtext" id="radius">{$areaRadius} m</div>
        <input
          type="range"
          min="100"
          max="5000"
          value="{$areaRadius}"
          step="100"
          class="slider"
          id="radiusSlider"
          on:input={onRadiusChanged}>
      </div>

      <div class="call-to-action">
        <button
          class="button--primary"
          on:click={onStartClicked}>
          Start
        </button>

        <a
          href={"/learn-more?continue=" + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}>
          Learn more
          <span class="hide-accessibly"> (how to play, etc)</span>
        </a>
      </div>
    {/if}
  
    <p class="subtext sponsor">Sponsored by <a href="https://maptiler.com" target="_blank"><span class="hide-accessibly">MapTiler</span> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Vrstva_1" x="0" y="0" viewBox="0 0 812 212" style="enable-background:new 0 0 812 212" xml:space="preserve"><style>.st8{fill:#fff}</style><path d="M94.3 164.2c9.2 9.2 33.8 34.3 33.8 34.3-.1.2 24.4-24.5 34.2-34.2l-34.1-34.1-33.9 34z" style="fill:#3a1888"/><path d="m128.3 130.2 34.1 34.1.2-.2 34-34L162.5 96l-34.2 34.2z" style="fill:#03a1c4"/><path d="M196.6 130.1c18.9-18.9 18.9-49.4.1-68.3L162.5 96l34.1 34.1z" style="fill:#05d0df"/><path d="m94.1 96-34 34 34.1 34.1.1.1 34-34L94.1 96z" style="fill:#761fe8"/><path d="M128.3 61.8 162.5 96l34.2-34.2-.1-.1-34.1-34.1-34.2 34.2z" style="fill:#ffaa01"/><path d="M60 61.9c-18.7 18.9-18.6 49.3.1 68.1l34-34L60 61.9z" style="fill:#f1175d"/><path d="M128.3 61.8 94.2 27.7l-34 34-.2.2L94.1 96l34.2-34.2z" style="fill:#fb3a1b"/><path d="M162.5 27.6c-18.9-18.8-49.4-18.8-68.2 0l-.1.1 34.1 34.1 34.2-34.2z" style="fill:#fbc935"/><path class="st8" d="M303.8 138.6v-34.9c0-8.6-4.5-16.4-13.3-16.4-8.7 0-13.9 7.8-13.9 16.4v34.9h-16.1V73.4h14.9l1.2 7.9c3.4-6.6 11-9 17.2-9 7.8 0 15.6 3.2 19.3 12.2 5.8-9.2 13.3-11.9 21.8-11.9 18.5 0 27.6 11.4 27.6 30.9v35.1h-16.1v-35.1c0-8.6-3.6-15.9-12.3-15.9-8.7 0-14.1 7.5-14.1 16.1v34.9h-16.2zM430.5 73.5H446v65.1h-15.2l-.8-9.5c-3.7 7.7-13.9 11.4-21.1 11.5-19.3.1-33.6-11.8-33.6-34.6 0-22.5 14.9-34.2 34-34.1 8.7 0 17 4.1 20.7 10.6l.5-9zM391.4 106c0 12.4 8.6 19.8 19.3 19.8 25.4 0 25.4-39.5 0-39.5-10.8 0-19.3 7.3-19.3 19.7zM459.5 165.8V73.5h15.1l1.1 9c5-7.3 13.7-10.4 21.1-10.4 20.1 0 33.4 14.9 33.4 34.1 0 19-12 34.1-32.9 34.1-6.9 0-17-2.1-21.7-9.3v34.9h-16.1zm54.6-59.7c0-10.2-6.9-18.5-18.5-18.5s-18.5 8.3-18.5 18.5 7.5 18.5 18.5 18.5 18.5-8.3 18.5-18.5zM559 53.7v19.7h22.2v5.4H559v39.8c0 8.8 1.9 15.1 12 15.1 3.2 0 6.7-1.1 10-2.6l2.2 5.3c-4.1 2-8.2 3.3-12.3 3.3-13.9 0-18.4-8.2-18.4-21V78.8h-13.9v-5.4h13.9v-19l6.5-.7zM604.7 52.1c0 6.9-10.4 6.9-10.4 0s10.4-6.9 10.4 0zm-8.6 21v65.5h6.5V73.1h-6.5zM627.6 46.2v92.5h-6.5V46.2h6.5zM730.2 73.4l.3 11.6c4.1-8.9 13.3-12.3 21.7-12.3 4.9-.1 9.6 1.2 14 3.8l-2.9 5.3c-3.4-2.1-7.3-3-11.1-3-12.2.1-21.5 9.9-21.5 21.8v38h-6.5V73.4h6z"/><g><path class="st8" d="M675.1 134.7c-11.5 0-21.4-7.2-25.5-17.4l52.8-14v.1l5.6-1.5c-2.3-16.5-16.2-29.3-33-29.3-18.4 0-33.3 15.2-33.3 34s14.9 34 33.3 34c13.8 0 25.6-8.5 30.6-20.7l-5.3-2.3c-4.1 10-13.9 17.1-25.2 17.1zm-27.6-28.1c0-15.5 12.3-28.1 27.5-28.1 11.9 0 22 7.7 25.9 18.5l-53 14c-.3-1.5-.4-2.9-.4-4.4z"/></g></svg></a></p>
  </div>
</div>

<style>
  .context-panel-wrapper {
    display: flex;
    flex-direction: column;
    grid-area: context-panel;
    overflow: hidden;
    z-index: 999999;
    padding: 1rem;
    background: #37003c;
    box-shadow: 0 -2px 2px rgba(0,0,0,0.3);
    color: #e6e4e4;
  }

  .context-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 40vw;
  }

  /* When context-panel is on the side */
  @media (min-width: 1200px),
  (min-aspect-ratio: 1.2/1), /* Browser support is poor for this, so we have to do this: */
  (min-width: 1200px) and (max-height: 912px),
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
    .context-panel {
      min-width: auto;
    }
  }

  @media(min-width: 600px) {
    .context-panel {
      max-width: 600px;
      margin: 0 auto;
    }
  }

  @media(min-width: 1200px) {
    .context-panel-wrapper {
      padding: 1.5rem;
      box-shadow: 2px 0 2px rgba(0,0,0,0.3);
    }
  }


  .context-panel > * + * {
    margin-top: 1.5rem;
    line-height: 1.5;
  }

  h1 {
    max-height: 40px;
    max-width: 300px;
    display: flex;
    line-height: 0;
    color: white;
  }

  h1 svg:first-of-type {
    flex: 1;
    margin-right: 1rem;
  }

  h1 svg:last-of-type {
    flex: 5;
  }

  .call-to-action {
    flex: 1;
    margin-top: 0;
  }

  a:focus,
  button:focus {
    /* Better constrast */
    box-shadow: 0 0 0 3px #ff0, 0 0 0 4px rgba(0,0,0,.2);
  }

  .call-to-action > a {
    color: white;
    text-decoration: none;
    display: none;
  }

  .call-to-action > a:hover {
    position: relative;
    bottom: 1px;
    text-decoration: underline;
  }

  .call-to-action > a,
  .call-to-action > button {
    margin: 1.5rem 1rem 0 0;
  }

  .call-to-action > button + a,
  .call-to-action > button + button {
    margin-right: 0;
  }

  .call-to-action > button ~ a,
  .call-to-action > button ~ button {
    margin-top: 1rem;
  }

  .subtext {
    display: block;
    font-size: 0.7rem;
    line-height: 1.2;
    margin: 0.5rem 0 0 0;
    color: rgba(255,255,255,0.5);
  }

  .sponsor {
    display: flex;
    align-items: center;
    gap: 2px;
    justify-content: flex-end;
  }

  .sponsor a {
    display: flex;
    flex: 1;
    max-width: 100px;
  }

  .sponsor a:hover {
    opacity: 0.8;
  }

  @media(min-width: 600px) { 
    .sponsor {
      justify-content: unset;
    }
  }

  .sponsor svg {
    flex: 1;
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
    color: rgba(255,255,255,0.5);
  }
</style>

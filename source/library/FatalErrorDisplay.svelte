<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import Button from "./forms/Button.svelte";

  export let error: Error | null = null;

  const onFeedbackClicked = () => {
    // @ts-expect-error ...
    window.location = window.location.origin + "/learn-more#feedback";
  };
  const onRefreshClicked = () => {
    // @ts-expect-error ...
    window.location = window.location.origin;
  };
</script>

<div class="full-screen-display">
  <div class="full-screen-display__inner">
    <h1>Something broke</h1>
    <p>There was an unexpected error. Sorry about this.</p>
    <Button
      class="button--primary"
      on:click={onRefreshClicked}
      theme="light"
      variant="primary"
    >
      Reset
    </Button>
    <Button
      class="button"
      on:click={onFeedbackClicked}
      theme="light"
    >
      Send feedback
    </Button>

    {#if error}
      <h2>Error details</h2>
      <pre>
        <code>{error.message + "\n" + error.stack}</code>
      </pre>
    {/if}
  </div>
</div>

<style></style>

<script lang="ts">
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
    <button
      class="button--primary"
      on:click={onRefreshClicked}>Reset</button
    >
    <button
      class="button"
      on:click={onFeedbackClicked}>Send feedback</button
    >

    {#if error}
      <h2>Error details</h2>
      <pre>
        <code>{error.message + "\n" + error.stack}</code>
      </pre>
    {/if}
  </div>
</div>

<style></style>

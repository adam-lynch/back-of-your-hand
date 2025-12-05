<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { ClientRequestError } from "../api/requestApi";
  import Button from "./forms/Button.svelte";

  export let error: Error | null = null;

  const isOrganization404 =
    error instanceof ClientRequestError &&
    error.requestArgs.url.includes("/organizations/");

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
    {#if isOrganization404}
      <h1>Organization not found</h1>
      <p
        ><code>{window.location.host}</code> is not correct. There is no
        <code>{window.location.host.split(".")[0]}</code>
        organization on <em>Back Of Your Hand</em>.</p
      >
      <p
        >If you're unsure what your organization URL is, please check your
        invite email.</p
      >
    {:else}
      <h1>Something broke</h1>
      <p>There was an unexpected error. Sorry about this.</p>
    {/if}

    {#if !isOrganization404}
      <Button
        class="button--primary"
        on:click={onRefreshClicked}
        theme="light"
        variant="primary"
      >
        Refresh
      </Button>
    {/if}

    <Button
      class="button"
      on:click={onFeedbackClicked}
      theme="light"
    >
      Send feedback
    </Button>

    {#if !isOrganization404 && error}
      <h2>Error details</h2>
      <pre class="error-pre">
        <code class="error-code">{error.message + "\n\n" + error.stack}</code>
      </pre>
    {/if}
  </div>
</div>

<style>
  .error-pre {
    white-space: pre-line;

    & code {
      text-wrap: auto;
    }
  }
</style>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import combineClasses from "../utilities/combineClasses";

  export let isForOneField = false;
  export let messages: string[];
</script>

{#if messages.length || isForOneField}
  <ul
    {...$$restProps}
    aria-live="polite"
    class={combineClasses("error-messages", $$restProps.class)}
  >
    {#if messages.length}
      {#each messages as message}
        <li class="error-message">{message}</li>
      {/each}
    {/if}
  </ul>
{/if}

<style>
  .error-messages {
    color: red;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
    min-height: 1rem;
  }
</style>

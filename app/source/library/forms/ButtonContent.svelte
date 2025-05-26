<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import type { ComponentType } from "svelte";

  export let Icon: ComponentType | undefined = undefined;
</script>

{#if Icon}
  <span class="button-content__icon-wrapper">
    <Icon class="button-content__icon" />
  </span>
  <span class="button-content__content">
    <slot />
  </span>
{:else}
  <slot />
{/if}

<style>
  .button-content__icon-wrapper {
    display: inline-flex;
  }

  :global(.button-content__icon) {
    transform: scale(1.5);
  }
</style>

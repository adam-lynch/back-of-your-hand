<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import type { ComponentType } from "svelte";

  export let hiddenButAccessibleSuffix: string | undefined;
  export let Icon: ComponentType | null = null;
  export let title: string | undefined;
</script>

{#if Icon}
  <span class="navigation-list-item__icon-wrapper">
    <Icon class="navigation-list-item__icon" />
  </span>
{/if}

{title}

{#if hiddenButAccessibleSuffix}
  <span class="hide-accessibly">
    {hiddenButAccessibleSuffix}
  </span>
{/if}

<style>
  .navigation-list-item__icon-wrapper {
    display: inline-flex;
    margin-right: 0.5rem;
  }

  :global(.navigation-list-item__icon) {
    color: rgba(255, 255, 255, 0.7);
  }
  :global(a[aria-current="page"] .navigation-list-item__icon) {
    color: unset;
  }
</style>

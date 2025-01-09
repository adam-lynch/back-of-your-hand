<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2025 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import combineClasses from "./utilities/combineClasses";
  import { type NavigationItem } from "./appHeader/navigation";
  import NavigationListItem from "./appHeader/NavigationListItem.svelte";
  import type { Readable } from "svelte/store";

  export let className = "";
  export let navigationItemsStore: Readable<NavigationItem[]>;
  export let shouldShowChildren = false;
</script>

<nav class={combineClasses("vertical-navigation", className)}>
  <ul class="vertical-navigation__list">
    {#each $navigationItemsStore as navigationItem}
      {#if shouldShowChildren && navigationItem.childItems?.length}
        <li class="vertical-navigation__list-item">
          <p class="nested-list__title">{navigationItem.title}</p>
          <ul class="nested-list">
            {#each navigationItem.childItems as childNavigationItem}
              <NavigationListItem
                className="vertical-navigation__list-item vertical-navigation__list-item--nested"
                navigationItem={childNavigationItem}
              />
            {/each}
          </ul>
        </li>
      {:else}
        <NavigationListItem
          className="vertical-navigation__list-item"
          {navigationItem}
        />
      {/if}
    {/each}
  </ul>
</nav>

<style>
  :where(.vertical-navigation) {
    display: flex;
  }

  .vertical-navigation__list {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 5px;
  }

  :global(.vertical-navigation__list-item) {
    flex: 1;

    padding: 5px 20px;

    &:first-of-type {
      padding-top: 10px;
    }

    &:last-of-type {
      padding-bottom: 10px;
    }

    &:has(.nested-list) {
      padding: 0;
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }

  .nested-list {
    flex: 1;

    display: flex;
    flex-direction: column;
  }

  .nested-list__title {
    padding-left: 20px;
    font-size: 10px;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  :global(.vertical-navigation__list-item--nested) {
    padding-left: 20px;
  }
</style>

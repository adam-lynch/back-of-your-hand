<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { type NavigationItem } from "./appHeader/navigation";
  import VerticalNavigation from "./VerticalNavigation.svelte";
  import Page from "./Page.svelte";
  import getInternalRoutes from "./routing/getInternalRoutes";
  import combineClasses from "./utilities/combineClasses";
  import { derived, readable, type Readable } from "svelte/store";

  export let customTitleStore = readable<string | null>(null);
  export let navigationItemsStore: Readable<NavigationItem[]>;
  export let internalRouteId: string;
  export let parentTitle: string;

  const internalRoute = getInternalRoutes()[internalRouteId];

  const title = derived(
    [customTitleStore],
    ([$customTitleStore]) => $customTitleStore || internalRoute.title,
  );
</script>

<Page {internalRoute}>
  <div class={combineClasses("page-with-sub-navigation", $$restProps.class)}>
    <aside class="page-with-sub-navigation__sidebar">
      <p class="page-with-sub-navigation__parent-title">{parentTitle}</p>
      {#if $navigationItemsStore.length > 1}
        <VerticalNavigation
          {navigationItemsStore}
          shouldShowChildren={true}
        />
      {/if}
    </aside>
    <main class="page-with-sub-navigation__main page__main-scrollable">
      <slot
        classNameToUse="page-with-sub-navigation__title-wrapper page__title-wrapper"
        name="title-wrapper"
        title={$title}
      >
        <div
          class="page-with-sub-navigation__title-wrapper page__title-wrapper"
        >
          <h1>{$title}</h1>
        </div>
      </slot>

      <div class="page-with-sub-navigation__content">
        <slot />
      </div>
    </main>
  </div>
</Page>

<style>
  .page-with-sub-navigation {
    flex: 1;

    display: flex;
    max-height: 100%;
  }

  .page-with-sub-navigation__sidebar {
    display: none;
    min-width: 200px;
    max-width: 600px;
    padding-block: 1rem;
    background: #120811;
    border-right: 1px solid #251824;

    /* This width needs to stay in sync with other code with a comment that mentions "HAMBURGER_MENU" */
    @media (min-width: 620px) {
      display: block;
    }

    @media (min-height: 900px) {
      padding-block: 2rem;
    }
  }

  :global(.page-with-sub-navigation__parent-title) {
    margin-left: 20px;
    margin-bottom: var(--page-title-bottom-margin);
    margin-top: 0;
    font-size: 2rem;
    opacity: 0.1;
    font-weight: bold;
  }

  .page-with-sub-navigation__main {
    display: block;
    flex: 1;

    padding-bottom: 150px;
  }

  :global(.page-with-sub-navigation__title-wrapper) {
    position: sticky;
    top: 0;
    padding: 1rem var(--page-content-padding-horizontal);
    padding-bottom: 0;
    margin-bottom: calc(var(--page-title-bottom-margin) - 1rem);

    @media (min-height: 900px) {
      padding-top: 2rem;
      padding-bottom: 1rem;
    }
  }

  :global(.page-with-sub-navigation__content) {
    padding-inline: var(--page-content-padding-horizontal);
  }
</style>

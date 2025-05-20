<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import AppHeader from "./appHeader/AppHeader.svelte";
  import type { InternalRoute } from "./routing/getInternalRoutes";
  import { onMount } from "svelte";

  export let internalRoute: InternalRoute;
  export let shouldHaveAppHeader = true;

  onMount(() => {
    console.debug("Page mount", {
      internalRoute,
      internalRouteId: internalRoute.id,
      location: window.location.pathname + window.location.search,
    });

    let newTitle = "Back Of Your Hand";
    if (internalRoute.id !== "game") {
      newTitle = `${internalRoute.title} | ${newTitle}`;
    }
    document.title = newTitle;
  });
</script>

{#if shouldHaveAppHeader}
  <AppHeader />
{/if}

<slot />

<style>
  :global(.route-wrapper:has(.page__main-scrollable)) {
    overflow: hidden !important;
    max-height: 100vh;

    & .page__title-wrapper {
      background: #0d030d;
      position: sticky;
      inset: 0;
      bottom: auto;
      z-index: 1;
    }

    & .page__main-scrollable {
      overflow: auto;
    }
  }
</style>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { derived, readable } from "svelte/store";
  import navigation from "./appHeader/navigation";
  import PageWithSubNavigation from "./PageWithSubNavigation.svelte";
  import combineClasses from "./utilities/combineClasses";

  export let customTitleStore = readable<string | null>(null);
  export let internalRouteId: string;

  const navigationItemsStore = derived([navigation], ([$navigation]) => {
    return (
      $navigation
        .find(({ id }) => id === "profile")
        ?.childItems?.find(({ id }) => id === "settings")?.childItems ?? []
    );
  });
</script>

<PageWithSubNavigation
  class="settings-page"
  {customTitleStore}
  {navigationItemsStore}
  {internalRouteId}
  parentTitle="Settings"
>
  <svelte:fragment
    let:classNameToUse
    let:title
    slot="title-wrapper"
  >
    <slot
      classNameToUse={combineClasses(
        classNameToUse,
        "settings-page__title-wrapper",
      )}
      name="title-wrapper"
      {title}
    >
      <div
        class={combineClasses(classNameToUse, "settings-page__title-wrapper")}
      >
        <h1
          {...{
            /* eslint-disable-next-line svelte/no-at-html-tags */
          }}>{@html title}</h1
        >
      </div>
    </slot>
  </svelte:fragment>

  <slot />
</PageWithSubNavigation>

<style>
</style>

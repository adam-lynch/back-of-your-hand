<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2025 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import WithPopover from "../WithPopover.svelte";
  import combineClasses from "../utilities/combineClasses";
  import navigation, { type NavigationItem } from "./navigation";
  import VerticalNavigation from "../VerticalNavigation.svelte";
  import { derived } from "svelte/store";

  export let className = "";
  export let filterNavigationItems: (
    navigationItems: NavigationItem[],
  ) => NavigationItem[] = (input) => input;
  export let shouldShowChildren = false;

  const navigationItemsStore = derived([navigation], ([$navigation]) =>
    filterNavigationItems($navigation),
  );
</script>

<div class={combineClasses(className, "with-navigation-popover")}>
  <WithPopover
    contentProps={{
      class: "with-navigation-popover__popover__content",
      collisionPadding: 0,
    }}
  >
    <svelte:fragment
      slot="trigger"
      let:builders
    >
      <slot {builders} />
    </svelte:fragment>

    <VerticalNavigation
      {navigationItemsStore}
      {shouldShowChildren}
      slot="content"
    />
  </WithPopover>
</div>

<style>
  :global(.with-navigation-popover__popover__content) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>

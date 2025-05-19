<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { useLocation } from "svelte-routing";

  import { isOrganizationUrl } from "../../userData/store";
  import combineClasses from "../utilities/combineClasses";
  import navigation from "./navigation";
  import NavigationListItem from "./NavigationListItem.svelte";
  import { derived } from "svelte/store";

  export let className = "";
  export let itemClassName = "";

  const location = useLocation();

  const filteredNavigationItems = derived([navigation], ([$navigation]) => {
    return $navigation.filter(
      ({ id, requirementsToExist }) =>
        id !== "profile" &&
        !requirementsToExist?.includes("not-organization-plan"),
    );
  });
  const gameNavigationItem = $filteredNavigationItems.find(
    (navigationItem) => navigationItem.internalRoute?.id === "game",
  );
  const shouldLinkBackToGame =
    $isOrganizationUrl &&
    gameNavigationItem &&
    !/\/($|game)/.test($location.pathname);
</script>

{#if $filteredNavigationItems.length > 1}
  <ul class={combineClasses(className, "list")}>
    {#each $filteredNavigationItems as navigationItem}
      <NavigationListItem
        canShowIcons={false}
        clickableElementClassName={combineClasses(
          itemClassName,
          "inline-navigation-list-item",
        )}
        {navigationItem}
      />
    {/each}
  </ul>
{:else if shouldLinkBackToGame}
  <ul class={combineClasses(className, "list")}>
    <NavigationListItem
      canShowIcons={false}
      className="back-to-game-list-item"
      clickableElementClassName={combineClasses(
        itemClassName,
        "inline-navigation-list-item",
      )}
      navigationItem={{
        ...gameNavigationItem,
        title: "Back to game",
      }}
    />
  </ul>
{/if}

<style>
  :where(.list) {
    display: flex;
  }

  :global(.inline-navigation-list-item) {
    padding-inline: calc(var(--app-header__minimum-horizontal-gap) / 2);
  }

  :global(.back-to-game-list-item a[data-is-partially-current="true"]) {
    display: none;
  }
</style>

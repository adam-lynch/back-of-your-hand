<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { navigate, useLocation } from "svelte-routing";

  import Button from "../forms/Button.svelte";
  import combineClasses from "../utilities/combineClasses";
  import { type NavigationItem } from "./navigation";
  import Link from "../Link.svelte";
  import NavigationListItemTitle from "./NavigationListItemTitle.svelte";
  import getInternalRoutes from "../routing/getInternalRoutes";
  import authController from "../../userData/authController";

  export let canShowIcons = true;
  export let className = "";
  export let clickableElementClassName = "";
  export let navigationItem: NavigationItem;

  const internalRoutes = getInternalRoutes();
  const location = useLocation();

  function makeHref(path: string): string {
    if (!navigationItem.shouldHaveContinueQueryParameter) {
      return path;
    }
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append(
      "continue",
      $location.pathname + $location.search + $location.hash,
    );
    return `${path}?${urlSearchParams.toString()}`;
  }

  async function performAction() {
    if (navigationItem.id === "log-out") {
      await authController.logOut();
      navigate(internalRoutes.loggedOut.path, { replace: false });
      return;
    }
    throw new Error("Unhandled");
  }
</script>

<li class={combineClasses(className, "navigation-list-item")}>
  {#if navigationItem.internalRoute}
    <Link
      className={clickableElementClassName}
      to={makeHref(navigationItem.internalRoute.path)}
    >
      <NavigationListItemTitle
        hiddenButAccessibleSuffix={navigationItem.titleHiddenButAccessibleSuffix}
        Icon={canShowIcons ? navigationItem.Icon : null}
        title={navigationItem.title || navigationItem.internalRoute.title}
      />
    </Link>
  {:else if navigationItem.externalPath}
    <Link
      className={clickableElementClassName}
      isExternal
      to={makeHref(navigationItem.externalPath)}
    >
      <NavigationListItemTitle
        hiddenButAccessibleSuffix={navigationItem.titleHiddenButAccessibleSuffix}
        Icon={canShowIcons ? navigationItem.Icon : null}
        title={navigationItem.title}
      />
    </Link>
  {:else}
    <Button
      on:click={performAction}
      Icon={canShowIcons ? navigationItem.Icon : undefined}
      size="small"
    >
      <NavigationListItemTitle
        hiddenButAccessibleSuffix={navigationItem.titleHiddenButAccessibleSuffix}
        title={navigationItem.title}
      />
    </Button>
  {/if}
</li>

<style>
  :where(.navigation-list-item) {
    display: flex;
    flex-direction: row;

    & > * {
      flex: 1;

      display: flex;
      align-items: center;
    }
  }
</style>

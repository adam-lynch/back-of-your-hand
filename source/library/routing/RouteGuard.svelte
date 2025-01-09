<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";
  import type { InternalRoute } from "./getInternalRoutes";
  import validateInternalRouteRequirementsToExist from "../routing/validateInternalRouteRequirementsToExist";
  import {
    hasUserOrganizationLoaded,
    isOrganizationUrl,
    userOrganizationIsAdmin,
  } from "../../userData/store";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let internalRoute: InternalRoute;

  const status = writable<"allowed" | "indeterminate" | "not-allowed">(
    internalRoute.doesNotRequireAuth ? "allowed" : "indeterminate",
  );

  onMount(() => {
    if (internalRoute.doesNotRequireAuth) {
      return;
    }

    if (!internalRoute.requirementsToExist?.length) {
      status.set("allowed");
      return;
    }

    return hasUserOrganizationLoaded.subscribe(($hasUserOrganizationLoaded) => {
      if (!$hasUserOrganizationLoaded) {
        return;
      }

      const newStatus = validateInternalRouteRequirementsToExist(
        internalRoute,
        {
          isOrganizationUrl: get(isOrganizationUrl),
          userOrganizationIsAdmin: get(userOrganizationIsAdmin),
        },
      )
        ? "allowed"
        : "not-allowed";
      status.set(newStatus);
    });
  });
</script>

{#if $status === "indeterminate"}
  <LoadingIndicator />
{:else if $status === "allowed"}
  <slot></slot>
{:else}
  <h1>Access denied</h1>
  <p>You do not have permission to view this page.</p>
{/if}

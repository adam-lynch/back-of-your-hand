<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { derived, writable } from "svelte/store";
  import Map from "./Map.svelte";
  import { areas, isOrganizationUrl } from "../../userData/store";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let areSettingsShown = writable(false);

  const isLoading = derived(
    [isOrganizationUrl, areas],
    ([$isOrganizationUrl, $areas]) => {
      return $isOrganizationUrl && $areas === null;
    },
  );
</script>

<div id="map-wrapper">
  {#if $isLoading}
    <LoadingIndicator />
  {:else}
    <Map {areSettingsShown} />
  {/if}
</div>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { derived, get as getFromStore, writable } from "svelte/store";
  import type { Area } from "../../api/resourceObjects";
  import fetchAreas from "../../userData/fetchAreas";
  import SelectInput from "../forms/SelectInput.svelte";
  import { areaRadius, areaSelection } from "../../utilities/store";
  import getCenterOfFeature from "../../utilities/getCenterOfFeature";
  import { PresetAreaShape } from "./types";
  import * as defaults from "../../utilities/defaults";
  import createFeatureFromPresetAreaShape from "../../utilities/createFeatureFromPresetAreaShape";
  import createFeatureFromArea from "../../utilities/createFeatureFromArea";
  import { areas } from "../../userData/store";

  const options = derived([areas], ([$areas]) => {
    if ($areas === null) {
      return [{ label: "Loading...", value: "" }];
    }
    const results = $areas.map((area) => ({
      label: area.attributes.name,
      value: area.id,
    }));
    results.push({
      label: "Custom",
      value: "custom",
    });
    return results;
  });

  const chosenValue = writable<Area["id"] | "custom" | undefined>(
    $areaSelection.areaId ?? "custom",
  );

  const onChanged = () => {
    const value = getFromStore(chosenValue);
    if (typeof value === "undefined" || $areas === null) {
      return;
    }

    if (value === "custom") {
      if (!$areas.length) {
        throw new Error("No areas");
      }
      // TODO: get default area from API instead of assuming first?
      const firstAreaFeature = createFeatureFromArea($areas[0]);
      areaSelection.set({
        areaId: null,
        feature: createFeatureFromPresetAreaShape(
          defaults.shape,
          getCenterOfFeature(firstAreaFeature),
          getFromStore(areaRadius),
        ),
        presetShape: defaults.shape,
        radius: getFromStore(areaRadius) ?? defaults.radius,
      });
      return;
    }

    const area = $areas.find(({ id }) => id === value);
    if (!area) {
      throw new Error("Can't find area on chosenAreaId change");
    }

    const feature = createFeatureFromArea(area);

    areaSelection.set({
      areaId: area.id,
      feature,
      presetShape: PresetAreaShape.MultiPolygon,
      radius: null,
    });
  };

  onMount(() => {
    fetchAreas({});
  });
</script>

<SelectInput
  {...$$restProps}
  bind:value={$chosenValue}
  disabled={$areas === null}
  on:change={onChanged}
  options={$options}
/>

<style>
</style>

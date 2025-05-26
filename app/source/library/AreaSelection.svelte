<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { areaRadius, areaShape, areaSelection } from "../utilities/store";
  import AreaSelect from "./game/AreaSelect.svelte";
  import { PresetAreaShape } from "./game/types";
  import { capitalize } from "lodash";
  import { isOrganizationUrl } from "../userData/store";
  import SelectInput from "./forms/SelectInput.svelte";
  import { writable } from "svelte/store";
  import Button from "./forms/Button.svelte";
  import OrganizationPlanModal from "./OrganizationPlanModal.svelte";

  const shapeOptions = Object.values(PresetAreaShape)
    .filter((shape) => shape !== PresetAreaShape.MultiPolygon)
    .map((shape) => ({ label: capitalize(shape), value: shape }));

  const chosenAreaShape = writable<(typeof shapeOptions)[0]["value"]>(
    shapeOptions.find(({ value }) => value === $areaShape)?.value,
  );

  chosenAreaShape.subscribe((value) => {
    if (!value) {
      return;
    }

    areaSelection.update((oldValue) => ({
      ...oldValue,
      presetShape: value,
    }));
  });

  const onRadiusChanged = () => {
    const radius = parseInt(
      (document.getElementById("radiusSlider") as HTMLInputElement).value,
    );
    areaSelection.update((oldValue) => ({
      ...oldValue,
      radius,
    }));
  };
</script>

{#if $isOrganizationUrl}
  <div class="settings__area">
    <label for="area-select">Area</label>
    <AreaSelect id="area-select" />
  </div>
{/if}

{#if $areaSelection.presetShape !== PresetAreaShape.MultiPolygon}
  <div class="settings__area-shape">
    <label for="areaShape">Area shape</label>
    <SelectInput
      bind:value={$chosenAreaShape}
      class="settings__area-shape-field"
      id="areaShape"
      options={shapeOptions}
    />

    {#if !$isOrganizationUrl}
      <div class="settings__area-shape-custom-button-wrapper">
        <OrganizationPlanModal>
          <Button
            builders={[builder]}
            let:builder
            size="small"
            slot="trigger"
          >
            Custom shapes 🔒
          </Button>
        </OrganizationPlanModal>
      </div>
    {/if}
  </div>

  <div>
    <label for="radiusSlider"
      >Area {#if $areaShape === "circle"}radius{:else}extent{/if}</label
    >
    <div class="subtext">{$areaRadius} m</div>
    <input
      type="range"
      min="100"
      max="5000"
      value={$areaRadius}
      step="100"
      class="slider"
      id="radiusSlider"
      on:input={onRadiusChanged}
    />
  </div>
{/if}

<style>
  .settings__area {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .settings__area-shape {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .settings__area-shape:has(.settings__area-shape-custom-button-wrapper) {
    & .settings__area-shape-field {
      margin-block: 5px;
    }
  }

  .settings__area-shape-custom-button-wrapper {
    text-align: right;
  }
</style>

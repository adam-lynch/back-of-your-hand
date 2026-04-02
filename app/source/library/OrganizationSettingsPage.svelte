<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { get } from "svelte/store";
  import SettingsPage from "./SettingsPage.svelte";
  import AutoSavingSelectField from "./forms/autoSavingFields/AutoSavingSelectField.svelte";
  import AutoSavingTextField from "./forms/autoSavingFields/AutoSavingTextField.svelte";
  import commonSchema from "./forms/commonSchema";
  import { organization } from "../userData/store";
  import yup from "./forms/yup";

  const limitRange = { min: 5, max: 250 };
  const questionsPerRoundLimitSchema = commonSchema
    .wholeNumber()
    .label("Maximum questions per round")
    .required("Maximum questions per round is required")
    .concat(commonSchema.inRange(limitRange))
    .test("gte-minimum", function (value) {
      if (!value) return true;
      const num = Number(value);
      if (num < limitRange.min || num > limitRange.max) return true;
      const minimum =
        get(organization)?.attributes.questionsPerRoundMinimum ?? 0;
      if (minimum > 0 && num < minimum) {
        return this.createError({
          message: `Must be at least ${minimum} (the current minimum)`,
        });
      }
      return true;
    });

  const minimumRange = { min: 1, max: 250 };
  const questionsPerRoundMinimumSchema = commonSchema
    .wholeNumber()
    .label("Minimum questions per round")
    .required("Minimum questions per round is required")
    .concat(commonSchema.inRange(minimumRange))
    .test("lte-maximum", function (value) {
      if (!value) return true;
      const num = Number(value);
      if (num < minimumRange.min || num > minimumRange.max) return true;
      const maximum =
        get(organization)?.attributes.questionsPerRoundLimit ?? 50;
      if (num > maximum) {
        return this.createError({
          message: `Must not exceed ${maximum} (the current maximum)`,
        });
      }
      return true;
    });
</script>

<SettingsPage internalRouteId="organization">
  {#if $organization}
    <div class="organization-settings-page__inner">
      <AutoSavingSelectField
        fieldProps={{
          labelText: "Map labels while guessing",
        }}
        schema={yup.string().required()}
        selectProps={{
          options: [
            { label: "Hidden", value: "hidden" },
            { label: "Major area names only", value: "majorAreaNames" },
            { label: "All area names", value: "allAreaNames" },
            { label: "All visible", value: "visible" },
          ],
          required: true,
        }}
        shouldPatchResourceOnWritableUpdated={true}
        writable={organization}
        writableSelector="attributes.mapLabelsWhileGuessing"
      />
      <AutoSavingSelectField
        fieldProps={{
          labelText: "Distance unit",
        }}
        schema={yup.string().required()}
        selectProps={{
          options: [
            { label: "Imperial (feet & miles)", value: "imperial" },
            { label: "Metric (metres & kilometres)", value: "metric" },
          ],
          required: true,
        }}
        shouldPatchResourceOnWritableUpdated={true}
        writable={organization}
        writableSelector="attributes.distanceUnit"
      />
      <AutoSavingTextField
        fieldProps={{
          labelText: "Maximum questions per round",
        }}
        schema={questionsPerRoundLimitSchema}
        shouldPatchResourceOnWritableUpdated={true}
        textProps={{
          autocomplete: "off",
          inputmode: "numeric",
          required: true,
        }}
        writable={organization}
        writableSelector="attributes.questionsPerRoundLimit"
      />
      <AutoSavingTextField
        fieldProps={{
          labelText: "Minimum questions per round",
        }}
        schema={questionsPerRoundMinimumSchema}
        shouldPatchResourceOnWritableUpdated={true}
        textProps={{
          autocomplete: "off",
          inputmode: "numeric",
          required: true,
        }}
        writable={organization}
        writableSelector="attributes.questionsPerRoundMinimum"
      />
    </div>
  {/if}
</SettingsPage>

<style>
  .organization-settings-page__inner {
    margin-top: 3rem;
    max-width: 500px;
  }
</style>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import SettingsPage from "./SettingsPage.svelte";
  import AutoSavingSelectField from "./forms/autoSavingFields/AutoSavingSelectField.svelte";
  import AutoSavingTextField from "./forms/autoSavingFields/AutoSavingTextField.svelte";
  import { organization } from "../userData/store";
  import yup from "./forms/yup";

  const questionsPerRoundLimitSchema = yup
    .string()
    .label("Maximum questions per round")
    .required("Maximum questions per round is required")
    .test(
      "is-whole-number",
      "Must be a whole number",
      (value) => !value || /^\d+$/.test(value),
    )
    .test("in-range", "Must be between 5 and 250", (value) => {
      if (!value || !/^\d+$/.test(value)) return true;
      const num = Number(value);
      return num >= 5 && num <= 250;
    });
</script>

<SettingsPage internalRouteId="organization">
  {#if $organization}
    <div class="organization-settings-page__inner">
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
    </div>
  {/if}
</SettingsPage>

<style>
  .organization-settings-page__inner {
    margin-top: 3rem;
    max-width: 500px;
  }
</style>

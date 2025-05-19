<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import type { Attribute } from "./types";
  import Table from "./Table.svelte";
  import PlaygroundPage from "./PlaygroundPage.svelte";
  import yup from "../forms/yup";
  import AutoSavingTextField from "../forms/autoSavingFields/AutoSavingTextField.svelte";
  import { writable } from "svelte/store";
  import AutoSavingSelectField from "../forms/autoSavingFields/AutoSavingSelectField.svelte";
  import prettifyRole from "../../utilities/prettifyRole";
  import commonSchema from "../forms/commonSchema";

  const attributes: Attribute[] = [];
</script>

<PlaygroundPage
  title="Auto-saving fields"
  let:pageTheme
>
  <Table {attributes}>
    <svelte:fragment
      slot="render-component"
      let:props
    >
      <AutoSavingTextField
        {...props}
        fieldProps={{
          labelText: "Email",
        }}
        schema={commonSchema.email()}
        shouldPatchResourceOnWritableUpdated={true}
        textProps={{
          autocomplete: "email",
          required: true,
          type: "email",
        }}
        theme={pageTheme}
        writable={writable({
          id: "example",
          type: "user",
          attributes: {
            email: "",
          },
        })}
        writableSelector={"attributes.email"}
      />

      <AutoSavingSelectField
        {...props}
        fieldProps={{
          labelText: "Select",
        }}
        schema={yup.string()}
        selectProps={{
          options: ["admin", "standard"].map((role) => ({
            label: prettifyRole(role),
            value: role,
          })),
        }}
        shouldPatchResourceOnWritableUpdated={true}
        theme={pageTheme}
        writable={writable({
          id: "example",
          type: "user",
          attributes: {
            role: "",
          },
        })}
        writableSelector="attributes.role"
      />
    </svelte:fragment>
  </Table>
</PlaygroundPage>

<style>
</style>

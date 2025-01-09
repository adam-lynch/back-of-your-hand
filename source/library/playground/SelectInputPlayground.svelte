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
  import SelectInput from "../forms/SelectInput.svelte";

  const attributes: Attribute[] = [
    {
      name: "aria-invalid",
      possibleValues: [undefined, true],
    },
    {
      name: "disabled",
      possibleValues: [undefined, true],
    },
    {
      name: "value",
      possibleValues: [undefined, "hello"],
    },
  ];
</script>

<PlaygroundPage
  title="SelectInput"
  let:pageTheme
>
  <Table {attributes}>
    <svelte:fragment
      slot="render-component"
      let:props
    >
      <SelectInput
        {...props}
        options={[
          { label: "Hello", value: "hello" },
          { label: "World", value: "world" },
        ]}
        theme={pageTheme}
      />
    </svelte:fragment>
  </Table>
</PlaygroundPage>

<style>
</style>

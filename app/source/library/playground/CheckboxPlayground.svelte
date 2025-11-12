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
  import CheckboxInput from "../forms/CheckboxInput.svelte";

  const attributes: Attribute[] = [
    {
      name: "aria-invalid",
      possibleValues: [undefined, true],
    },
    {
      name: "checked",
      possibleValues: [undefined, false, true],
    },
    {
      name: "disabled",
      possibleValues: [undefined, true],
    },
  ];
</script>

<PlaygroundPage
  title="CheckboxInput"
  let:pageTheme
>
  <Table {attributes}>
    <svelte:fragment
      slot="render-component"
      let:props
    >
      <CheckboxInput
        {...props}
        theme={pageTheme}
      />
    </svelte:fragment>
  </Table>
</PlaygroundPage>

<style>
</style>

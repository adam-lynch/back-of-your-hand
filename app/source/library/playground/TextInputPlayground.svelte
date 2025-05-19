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
  import TextInput from "../forms/TextInput.svelte";

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
      name: "readonly",
      possibleValues: [undefined, true],
    },
    {
      name: "type",
      possibleValues: [undefined, "email", "number", "password", "text"],
    },
    {
      name: "value",
      possibleValues: [undefined, "Hello world"],
    },
  ];
</script>

<PlaygroundPage
  title="TextInput"
  let:pageTheme
>
  <Table {attributes}>
    <svelte:fragment
      slot="render-component"
      let:props
    >
      <TextInput
        {...props}
        theme={pageTheme}
      />
    </svelte:fragment>
  </Table>
</PlaygroundPage>

<style>
</style>

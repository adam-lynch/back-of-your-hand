<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import DogIcon from "~icons/mdi/dog";
  import Button from "../forms/Button.svelte";
  import type { Attribute } from "./types";
  import Table from "./Table.svelte";
  import PlaygroundPage from "./PlaygroundPage.svelte";
  import makeClickHandlerIgnoreDoubleClicks from "../utilities/makeClickHandlerIgnoreDoubleClicks";

  const attributes: Attribute[] = [
    {
      name: "consequence",
      possibleValues: [undefined, "destruction"],
    },
    {
      name: "disabled",
      possibleValues: [undefined, true],
    },
    {
      name: "href",
      possibleValues: [undefined, "https://example.com"],
    },
    {
      name: "Icon",
      possibleValues: [undefined, { id: "dog", value: DogIcon }],
    },
    {
      name: "size",
      possibleValues: [undefined, "small", "large"],
    },
    {
      name: "tagName",
      possibleValues: [undefined, "a", "button", "input"],
    },
    {
      name: "theme",
      possibleValues: [undefined, "dark", "light"],
    },
    {
      name: "type",
      possibleValues: [undefined, "button", "reset", "submit"],
    },
    {
      name: "variant",
      possibleValues: [
        undefined,
        "primary",
        "secondary",
        "tertiary",
        "text",
        "unstyled",
      ],
    },
  ];
</script>

<PlaygroundPage title="Button">
  <Table {attributes}>
    <svelte:fragment
      slot="render-component"
      let:props
    >
      <Button
        {...props}
        on:click={makeClickHandlerIgnoreDoubleClicks((event) => {
          event.preventDefault();
          console.log("Button clicked " + Math.random());
        })}
        value={"Value prop"}
      >
        Slot content
      </Button>
    </svelte:fragment>
  </Table>
</PlaygroundPage>

<style>
</style>

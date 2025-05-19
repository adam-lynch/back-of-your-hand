<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import type { Attribute } from "./types";

  export let attributes: Attribute[] = [];

  const columns: {
    attribute: Attribute;
    id: string;
    value: Attribute["possibleValues"][0];
  }[] = attributes
    .map((attribute) =>
      attribute.possibleValues.map((possibleValue) => ({
        attribute,
        id:
          attribute.name +
          "=" +
          (typeof possibleValue === "object" && "id" in possibleValue
            ? possibleValue.id
            : possibleValue),
        value:
          typeof possibleValue === "object" && "value" in possibleValue
            ? possibleValue.value
            : possibleValue,
      })),
    )
    .flat()
    .filter((column) => typeof column.value !== "undefined");

  columns.unshift({
    attribute: {
      name: "ignore",
      possibleValues: ["ignore"],
    },
    id: "nothing",
    value: "ignore",
  });
</script>

<table>
  <tr>
    <th></th>
    {#each columns as column}
      <th>{column.id}</th>
    {/each}
  </tr>

  {#each columns.filter((column) => typeof column.value !== "undefined") as row}
    <tr>
      <th>{row.id}</th>
      {#each columns as column}
        <td>
          {#if row.attribute.name === column.attribute.name && row.id !== "nothing"}
            N/A
          {:else}
            <slot
              name="render-component"
              props={{
                [column.attribute.name]: column.value,
                [row.attribute.name]: row.value,
              }}
            />
          {/if}
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style>
  table {
    border-collapse: collapse;
    table-layout: auto;
    width: auto;
    white-space: nowrap;
  }

  td,
  th {
    padding: 10px;
    border: 1px dashed #555;
  }

  th {
    background: black;
    color: white;
    position: sticky;
    left: 0;
    z-index: 1;

    &:is(table tr:first-child th) {
      left: auto;
      top: 0;
      z-index: 2;
    }

    &:is(table tr:first-child th:first-child) {
      left: 0;
      z-index: 3;
    }
  }

  td {
    vertical-align: top;
  }
</style>

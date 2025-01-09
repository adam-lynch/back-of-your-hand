<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import get from "lodash/get";
  import combineClasses from "./utilities/combineClasses";

  export let columns: {
    formatValue?: (input: string) => string;
    maxWidth?: string;
    minWidth?: string;
    name: string;
    propertyPath?: string;
  }[];
  export let data: Record<string, unknown>[] = [];
  export let onClickBodyRow:
    | ((event: MouseEvent, rowData: Record<string, unknown>) => void)
    | null = null;
  export let tHeadClass: string | undefined = undefined;

  function makeRowClickHandler(rowData: Record<string, unknown>) {
    if (onClickBodyRow) {
      return (event: MouseEvent) => onClickBodyRow(event, rowData);
    }
  }

  function makeCellValue(
    column: (typeof columns)[0],
    rowData: (typeof data)[0],
  ): string | undefined {
    if (!column.propertyPath) {
      return;
    }
    const value = get(rowData, column.propertyPath) as
      | string
      | number
      | undefined;
    let result = (value || "").toString();
    if (column.formatValue) {
      result = column.formatValue(result);
    }
    return result;
  }

  const gridTemplateColumnsValue = columns
    .map(
      (column) =>
        `minmax(${column.minWidth ?? "150px"}, ${column.maxWidth ?? "1.33fr"})`,
    )
    .join(" ");
  const style = `grid-template-columns: ${gridTemplateColumnsValue};`;
</script>

<div
  {...$$restProps}
  class={combineClasses("table__wrapper", $$restProps.class)}
>
  <table
    class="table"
    {style}
  >
    <thead class={tHeadClass}>
      <tr>
        {#each columns as column}
          <th>{column.name}</th>
        {/each}
      </tr>
    </thead>

    <tbody>
      {#each data as rowData}
        <tr on:click={makeRowClickHandler(rowData)}>
          {#each columns as column}
            <slot
              name="body-cell"
              {column}
              {columns}
              {data}
              defaultValue={makeCellValue(column, rowData)}
              {rowData}
            >
              <td>{makeCellValue(column, rowData)}</td>
            </slot>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <slot name="end-of-wrapper" />
</div>

<style>
  .table__wrapper {
    overflow-x: auto;
    max-width: 100vw;
  }

  .table {
    display: grid;

    & thead,
    & tbody,
    & tr {
      display: contents;
    }

    & thead th {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);

      @media (min-height: 900px) {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        padding-bottom: 1rem;
      }
    }

    & tbody {
      & td,
      & th {
        padding-block: 0.9rem;
        font-size: 0.9rem;

        @media (min-height: 900px) {
          padding-block: 1rem;
          font-size: 1rem;
        }
      }

      & tr:not(:first-child) {
        & td,
        & th {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
      }
    }

    & td,
    & th {
      padding: 0.5rem;
      text-align: left;
    }
  }
</style>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import ResourceListInfiniteScroller from "./ResourceListInfiniteScroller.svelte";
  import Table from "./Table.svelte";
  import api, { type FetchResourceListOptions } from "../api";

  export let columns: {
    formatValue?: (input: string) => string;
    maxWidth?: string;
    minWidth?: string;
    name: string;
    propertyPath?: string;
  }[];
  export let fetchResourceList: (
    partialOptions: FetchResourceListOptions,
  ) => ReturnType<typeof api.fetchResourceList>;
  export let onClickBodyRow:
    | ((event: MouseEvent, rowData: Record<string, unknown>) => void)
    | null = null;
  export let pageSize = 20;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let postFilter: (items: any) => boolean = () => true;
  export let tHeadClass: string | undefined = undefined;
</script>

<ResourceListInfiniteScroller
  {...$$restProps}
  {fetchResourceList}
  {pageSize}
  {postFilter}
>
  <svelte:fragment
    let:resourceObjects
    slot="main"
  >
    <Table
      class="resource-list-infinite-scroll-table__wrapper"
      {columns}
      data={resourceObjects}
      {tHeadClass}
      {onClickBodyRow}
    >
      <slot
        {column}
        {columns}
        {data}
        {defaultValue}
        name="body-cell"
        let:column
        let:defaultValue
        let:columns
        let:data
        let:rowData
        {rowData}
        slot="body-cell"
      >
        <td>{defaultValue}</td>
      </slot>
    </Table>
  </svelte:fragment>
</ResourceListInfiniteScroller>

<style>
  :global(.resource-list-infinite-scroll-table__wrapper.table__wrapper) {
    max-width: unset;
    overflow-x: unset;
  }
</style>

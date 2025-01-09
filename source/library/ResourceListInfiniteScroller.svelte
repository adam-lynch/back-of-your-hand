<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import * as svelteStore from "svelte/store";

  import api, { type FetchResourceListOptions } from "../api";
  import InfiniteScroller from "./InfiniteScroller.svelte";
  import { pickFromIncluded } from "../api/pickFromResponse";
  import { isArray } from "lodash";
  import type { ResourceIdentifierObject } from "jsonapi-typescript";

  export let fetchResourceList: (
    partialOptions: FetchResourceListOptions,
  ) => ReturnType<typeof api.fetchResourceList>;
  type TResourceObject = Awaited<
    ReturnType<typeof fetchResourceList>
  >["data"][0];

  export let pageSize = 20;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let postFilter: (items: any) => boolean = () => true;

  const resourceObjects = svelteStore.writable<TResourceObject[]>([]);

  const numberOfPagesLoaded = svelteStore.writable(0);
  const totalPageCount = svelteStore.writable<number | null>(null);
  const canLoadMore = svelteStore.derived(
    [numberOfPagesLoaded, totalPageCount],
    ([numberOfPagesLoaded, totalPageCount]) => {
      return totalPageCount === null || numberOfPagesLoaded < totalPageCount;
    },
  );

  async function loadMore() {
    const pageCountValue = svelteStore.get(numberOfPagesLoaded);
    const response = await fetchResourceList({
      page: {
        number: pageCountValue + 1,
        size: pageSize,
      },
    });

    resourceObjects.update((old) => {
      let newItems = response.data;

      if (response.included) {
        newItems = newItems.map((resourceObject) => {
          if (!resourceObject.relationships) {
            throw new Error("Resource object has no relationships");
          }

          const relationshipsEntries = Object.entries(
            resourceObject.relationships,
          ).map(([relationshipName, relationshipValue]) => {
            if (relationshipValue.data && !isArray(relationshipValue.data)) {
              const resourceObjectIdentifier =
                relationshipValue.data as ResourceIdentifierObject;
              const relatedResourceObject = pickFromIncluded(
                response,
                ({ id, type }) =>
                  id === resourceObjectIdentifier.id &&
                  type === resourceObjectIdentifier.type,
              );
              if (relatedResourceObject) {
                return [
                  relationshipName,
                  {
                    data: relatedResourceObject,
                  },
                ];
              }
            }
            return [relationshipName, relationshipValue];
          });

          return {
            ...resourceObject,
            relationships: Object.fromEntries(relationshipsEntries),
          };
        });
      }

      return [...old, ...newItems];
    });

    numberOfPagesLoaded.set(pageCountValue + 1);
    if (response.meta?.pagination) {
      totalPageCount.set((response.meta.pagination as { pages: number }).pages);
    }
  }
</script>

<InfiniteScroller
  {...$$restProps}
  canLoadMore={$canLoadMore}
  {loadMore}
>
  <slot
    name="main"
    resourceObjects={$resourceObjects.filter(postFilter)}
    slot="main"
  />
</InfiniteScroller>

<style></style>

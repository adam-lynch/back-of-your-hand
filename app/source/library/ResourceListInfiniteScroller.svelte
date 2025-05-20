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
  import type {
    DocWithData,
    ResourceIdentifierObject,
  } from "jsonapi-typescript";
  import type { AnyResourceObject } from "../api/resourceObjects";

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

  // Recursive
  function replaceRelationshipsWithIncludedIfPossible(
    relationships: AnyResourceObject["relationships"],
    response: DocWithData<AnyResourceObject[]>,
  ) {
    if (!relationships) {
      return relationships;
    }

    const relationshipsEntries = Object.entries(relationships).map(
      ([relationshipName, relationshipValue]) => {
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
            const newRelationshipValue = {
              data: relatedResourceObject,
            };

            if (newRelationshipValue.data.relationships) {
              newRelationshipValue.data.relationships =
                replaceRelationshipsWithIncludedIfPossible(
                  relatedResourceObject.relationships,
                  response,
                );
            }

            return [relationshipName, newRelationshipValue];
          }
        }

        return [relationshipName, relationshipValue];
      },
    );

    return Object.fromEntries(relationshipsEntries);
  }

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

          return {
            ...resourceObject,
            relationships: replaceRelationshipsWithIncludedIfPossible(
              resourceObject.relationships,
              response,
            ),
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

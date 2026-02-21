<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import AddIcon from "~icons/mdi/add";
  import { navigate } from "svelte-routing";
  import toast from "svelte-french-toast";
  import Button from "./forms/Button.svelte";
  import ConfirmationModal from "./ConfirmationModal.svelte";
  import SettingsPage from "./SettingsPage.svelte";
  import getInternalRoutes from "./routing/getInternalRoutes";
  import replacePathParameters from "./routing/replacePathParameters";
  import eventEmitter from "../utilities/eventEmitter";
  import type { MapFeature } from "../api/resourceObjects";
  import ResourceListInfiniteScrollTable from "./ResourceListInfiniteScrollTable.svelte";
  import type { FetchResourceListOptions } from "../api";
  import api from "../api";
  import * as svelteStore from "svelte/store";
  import CreatePointOfInterestModal from "./CreatePointOfInterestModal.svelte";
  import combineClasses from "./utilities/combineClasses";
  import getClosestElement from "../utilities/getClosestElement";
  import getCommonToastOptions from "./utilities/getCommonToastOptions";

  const internalRoutes = getInternalRoutes();
  const mapFeatureIdsToExcludeWritable = svelteStore.writable<
    MapFeature["id"][]
  >([]);

  const onClickBodyRow = (
    event: MouseEvent,
    rowData: Record<string, unknown>,
  ) => {
    const closestElement = getClosestElement(event.target);
    if (!closestElement || closestElement.closest("a, button")) {
      return;
    }
    const mapFeature = rowData as unknown as MapFeature;
    navigate(
      replacePathParameters(internalRoutes.pointOfInterest.path, {
        mapFeatureId: mapFeature.id,
      }),
    );
  };

  const onMapFeatureDeleted = ({ mapFeatureId }: { mapFeatureId: string }) => {
    if (
      !svelteStore.get(mapFeatureIdsToExcludeWritable).includes(mapFeatureId)
    ) {
      mapFeatureIdsToExcludeWritable.update((old) => [...old, mapFeatureId]);
    }
  };

  onMount(() => {
    eventEmitter.on("map-feature-deleted", onMapFeatureDeleted);

    return () => {
      eventEmitter.off("map-feature-deleted", onMapFeatureDeleted);
    };
  });

  const fetchResourceList = (options: FetchResourceListOptions) =>
    api.fetchResourceList<MapFeature>("mapFeature", options);

  const postFilter = svelteStore.derived(
    [mapFeatureIdsToExcludeWritable],
    ([$mapFeatureIdsToExclude]) => {
      return (resourceObject: MapFeature) =>
        !$mapFeatureIdsToExclude.includes(resourceObject.id);
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const castRowData = (input: any) => input as unknown as MapFeature;

  let tableKey = 1;

  function refreshMapFeatures() {
    tableKey++;
  }

  const handleDeleteConfirm = async (mapFeature: MapFeature) => {
    await api.deleteResource<MapFeature>("mapFeature", mapFeature.id);
    onMapFeatureDeleted({ mapFeatureId: mapFeature.id });
    eventEmitter.emit("map-feature-deleted", {
      mapFeatureId: mapFeature.id,
    });
    toast.success("Point of interest deleted!", getCommonToastOptions());
  };
</script>

<SettingsPage internalRouteId="pointsOfInterest">
  <svelte:fragment
    let:classNameToUse
    let:title
    slot="title-wrapper"
  >
    <div
      class={combineClasses(
        classNameToUse,
        "points-of-interest__title-wrapper",
      )}
    >
      <div class="points-of-interest__title-row">
        <h1 class="points-of-interest__title-heading">{title}</h1>
        <CreatePointOfInterestModal on:created={refreshMapFeatures}>
          <Button
            slot="trigger"
            let:builder
            builders={[builder]}
            Icon={AddIcon}
            size="medium">Add</Button
          >
        </CreatePointOfInterestModal>
      </div>
      <p class="points-of-interest__description">
        Include custom points (like stations and landmarks) as questions
        alongside streets.
      </p>
    </div>
  </svelte:fragment>

  {#key tableKey}
    <ResourceListInfiniteScrollTable
      class="points-of-interest__table-wrapper"
      columns={[
        {
          minWidth: "200px",
          name: "Name",
          propertyPath: "attributes.name",
        },
        {
          minWidth: "130px",
          maxWidth: "0.5fr",
          name: "Actions",
        },
      ]}
      {fetchResourceList}
      {onClickBodyRow}
      postFilter={$postFilter}
      tHeadClass="hide-accessibly--important points-of-interest__thead"
    >
      <svelte:fragment
        let:column
        let:defaultValue
        let:rowData
        slot="body-cell"
      >
        {#if column.name === "Actions"}
          <td>
            <ConfirmationModal
              confirmText="Delete"
              description="This cannot be undone."
              onConfirm={() => handleDeleteConfirm(castRowData(rowData))}
              title="Delete point of interest?"
            >
              <Button
                slot="trigger"
                let:builder
                builders={[builder]}
                consequence="destruction"
                size="small">Delete</Button
              >
            </ConfirmationModal>
          </td>
        {:else if column.name === "Name"}
          <td class="points-of-interest__name-cell">{defaultValue}</td>
        {:else}
          <td>{defaultValue}</td>
        {/if}
      </svelte:fragment>
    </ResourceListInfiniteScrollTable>
  {/key}
</SettingsPage>

<style>
  :global(.points-of-interest__title-wrapper) {
    @media (min-width: 800px) {
      position: relative;
    }
  }

  :global(.points-of-interest__title-row) {
    align-items: start;
    display: flex;
    flex-direction: row;
  }

  :global(.points-of-interest__title-heading) {
    flex: 1;
  }

  :global(.points-of-interest__description) {
    font-size: 0.875rem;
    margin: 0.25rem 0 0;
    opacity: 0.6;

    @media (min-width: 800px) {
      position: absolute;
      top: 100%;
    }
  }

  :global(.points-of-interest__table-wrapper) {
    margin-left: -0.5rem;

    @media (min-width: 800px) {
      overflow: hidden;
    }
  }

  :global(.points-of-interest__table-wrapper.table .points-of-interest__thead) {
    display: block;
  }

  :global(.points-of-interest__table-wrapper table) {
    width: 100%;

    @media (min-width: 800px) {
      margin-top: -0.25rem;
    }

    & th,
    & td {
      align-content: center;
    }
  }

  :global(.points-of-interest__name-cell) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :global(.points-of-interest__table-wrapper tr) {
    cursor: pointer;

    &:hover {
      & td,
      & th {
        background: rgba(255, 255, 255, 0.03);
      }
    }
  }
</style>

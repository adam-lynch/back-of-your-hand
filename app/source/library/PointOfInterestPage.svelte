<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import toast from "svelte-french-toast";
  import { navigate } from "svelte-routing";
  import debounce from "lodash/debounce";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import { reporter } from "@felte/reporter-svelte";

  import SettingsPage from "./SettingsPage.svelte";
  import AutoSavingTextField from "./forms/autoSavingFields/AutoSavingTextField.svelte";
  import Field from "./forms/Field.svelte";
  import TextInput from "./forms/TextInput.svelte";
  import Button from "./forms/Button.svelte";
  import ConfirmationModal from "./ConfirmationModal.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import type { MapFeature } from "../api/resourceObjects";
  import * as svelteStore from "svelte/store";
  import getInternalRoutes from "./routing/getInternalRoutes";
  import yup from "./forms/yup";
  import commonSchema from "./forms/commonSchema";
  import api from "../api";
  import { ClientRequestError } from "../api/requestApi";
  import eventEmitter from "../utilities/eventEmitter";
  import getCommonToastOptions from "./utilities/getCommonToastOptions";
  import { reportError } from "../utilities/setUpErrorReporting";

  export let routePathParameters: {
    mapFeatureId: string;
  };

  const mapFeatureStore = svelteStore.writable<MapFeature | null>(null);
  const internalRoutes = getInternalRoutes();
  const did404 = svelteStore.writable(false);

  const customTitleStore = svelteStore.derived(
    [mapFeatureStore],
    ([$mapFeature]) => {
      if (!$mapFeature) {
        return null;
      }
      return $mapFeature.attributes.name;
    },
  );

  const coordinateSchema = yup.object({
    latitude: commonSchema.latitude(),
    longitude: commonSchema.longitude(),
  });
  type CoordinateSchema = yup.InferType<typeof coordinateSchema>;

  const coordinateForm = createForm<CoordinateSchema>({
    extend: [validator({ schema: coordinateSchema }), reporter],
    initialValues: { latitude: "", longitude: "" },
    onSubmit: async (values) => {
      const mapFeature = svelteStore.get(mapFeatureStore);
      if (!mapFeature) return;

      try {
        await api.patchResource<MapFeature>({
          id: mapFeature.id,
          type: "mapFeature",
          attributes: {
            geom: {
              type: "Point",
              coordinates: [
                parseFloat(values.longitude),
                parseFloat(values.latitude),
              ],
            },
          },
        });
        // Don't update store from patch response to avoid overwriting user input
      } catch (error) {
        reportError(error);
        toast.error("Failed to update coordinates", getCommonToastOptions());
      }
    },
  });

  const debouncedSubmit = debounce(() => {
    coordinateForm.handleSubmit();
  }, 250);

  // Cast to untyped form for Field component compatibility
  const coordinateFormForField = coordinateForm as unknown as ReturnType<
    typeof createForm
  >;

  let hasSetInitialCoordinates = false;
  const unsubscribeFromStore = mapFeatureStore.subscribe(
    async ($mapFeature) => {
      if (!$mapFeature || hasSetInitialCoordinates) return;

      const geom = $mapFeature.attributes.geom;
      if (geom.type !== "Point") {
        console.error("Expected Point geometry, got:", geom.type);
        return;
      }

      await tick();
      coordinateForm.setFields({
        longitude: geom.coordinates[0].toString(),
        latitude: geom.coordinates[1].toString(),
      });
      hasSetInitialCoordinates = true;
    },
  );

  onDestroy(unsubscribeFromStore);

  onMount(async () => {
    try {
      const response = await api.fetchResource<MapFeature>(
        "mapFeature",
        routePathParameters.mapFeatureId,
      );
      mapFeatureStore.set(response.data);
    } catch (error) {
      if (
        error instanceof ClientRequestError &&
        error.response.status === 404
      ) {
        did404.set(true);
        return;
      }
      throw error;
    }
  });

  const handleDeleteConfirm = async () => {
    const mapFeature = svelteStore.get(mapFeatureStore);
    if (!mapFeature) {
      return;
    }

    await api.deleteResource<MapFeature>("mapFeature", mapFeature.id);
    eventEmitter.emit("map-feature-deleted", {
      mapFeatureId: mapFeature.id,
    });
    toast.success("Point of interest deleted!", getCommonToastOptions());
    navigate(internalRoutes.pointsOfInterest.path, { replace: false });
  };
</script>

<SettingsPage
  {customTitleStore}
  internalRouteId="pointOfInterest"
>
  {#if $did404}
    <p>Point of interest not found</p>
  {:else if $mapFeatureStore}
    <div class="point-of-interest-page__inner">
      <AutoSavingTextField
        fieldProps={{
          labelText: "Name",
        }}
        schema={yup.string().required()}
        shouldPatchResourceOnWritableUpdated={true}
        textProps={{
          autocomplete: "off",
          autofocus: true,
          required: true,
        }}
        writable={mapFeatureStore}
        writableSelector="attributes.name"
      />

      <form
        on:submit|preventDefault
        use:coordinateForm.form
      >
        <Field
          form={coordinateFormForField}
          labelText="Latitude"
          name="latitude"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            autocomplete="off"
            class={_class}
            {id}
            inputmode="decimal"
            name={_name}
            on:input={debouncedSubmit}
            required
            type="text"
          />
        </Field>

        <Field
          form={coordinateFormForField}
          labelText="Longitude"
          name="longitude"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            autocomplete="off"
            class={_class}
            {id}
            inputmode="decimal"
            name={_name}
            on:input={debouncedSubmit}
            required
            type="text"
          />
        </Field>
      </form>

      <div class="point-of-interest-page__actions">
        <ConfirmationModal
          confirmText="Delete"
          description="This cannot be undone."
          onConfirm={handleDeleteConfirm}
          title="Delete point of interest?"
        >
          <Button
            slot="trigger"
            let:builder
            builders={[builder]}
            consequence="destruction"
          >
            Delete
          </Button>
        </ConfirmationModal>
      </div>
    </div>
  {:else}
    <LoadingIndicator />
  {/if}
</SettingsPage>

<style>
  .point-of-interest-page__inner {
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
    max-width: 500px;
  }

  .point-of-interest-page__inner form {
    display: flex;
    flex-direction: column;
  }

  .point-of-interest-page__actions {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    margin-top: 1.5rem;
  }
</style>

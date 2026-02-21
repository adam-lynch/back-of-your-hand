<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import toast from "svelte-french-toast";
  import MultiFieldFormModal from "./MultiFieldFormModal.svelte";
  import yup from "./forms/yup";
  import commonSchema from "./forms/commonSchema";
  import Field from "./forms/Field.svelte";
  import TextInput from "./forms/TextInput.svelte";
  import Button from "./forms/Button.svelte";
  import ErrorMessages from "./forms/ErrorMessages.svelte";
  import api from "../api";
  import type { MapFeature } from "../api/resourceObjects";
  import getCommonToastOptions from "./utilities/getCommonToastOptions";

  let name = "";
  let latitude = "";
  let longitude = "";

  function onFormReset() {
    name = "";
    latitude = "";
    longitude = "";
  }

  const dispatch = createEventDispatcher();

  const handleOnSubmit = async () => {
    await api.postResource<MapFeature>({
      type: "mapFeature",
      attributes: {
        geom: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        name,
        origin: "user",
        tags: {},
      },
    });

    dispatch("created");
    toast.success("Point of interest created!", getCommonToastOptions());
  };
</script>

<MultiFieldFormModal
  schema={yup.object({
    name: yup.string().label("Name").required().max(255),
    latitude: commonSchema.latitude(),
    longitude: commonSchema.longitude(),
  })}
  on:formReset={onFormReset}
  onSubmit={handleOnSubmit}
  title="Add point of interest"
>
  <svelte:fragment
    slot="trigger"
    let:builder
  >
    <slot
      name="trigger"
      {builder}
    />
  </svelte:fragment>

  <svelte:fragment
    slot="fields"
    let:form
    let:generalErrorMessages
  >
    <Field
      {form}
      labelText="Name"
      name="name"
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      theme="dark"
    >
      <TextInput
        aria-describedby={ariaDescribedby}
        autocomplete="off"
        bind:value={name}
        class={_class}
        {id}
        maxlength={255}
        name={_name}
        placeholder="City Hall"
        required
        {theme}
        type="text"
      />
    </Field>

    <Field
      {form}
      labelText="Latitude"
      name="latitude"
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      theme="dark"
    >
      <TextInput
        aria-describedby={ariaDescribedby}
        autocomplete="off"
        bind:value={latitude}
        class={_class}
        {id}
        inputmode="decimal"
        name={_name}
        placeholder="53.35"
        required
        {theme}
        type="text"
      />
    </Field>

    <Field
      {form}
      labelText="Longitude"
      name="longitude"
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      theme="dark"
    >
      <TextInput
        aria-describedby={ariaDescribedby}
        autocomplete="off"
        bind:value={longitude}
        class={_class}
        {id}
        inputmode="decimal"
        name={_name}
        placeholder="-6.25"
        required
        {theme}
        type="text"
      />
    </Field>

    <ErrorMessages messages={generalErrorMessages} />
  </svelte:fragment>

  <svelte:fragment
    slot="footer"
    let:closeModal
    let:isSubmitting
  >
    <Button
      on:click={(event) => {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
      }}
      theme="dark">Cancel</Button
    >
    <Button
      disabled={isSubmitting}
      theme="dark"
      type="submit"
      variant="primary">Add</Button
    >
  </svelte:fragment>
</MultiFieldFormModal>

<style>
</style>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { writable } from "svelte/store";
  import toast from "svelte-french-toast";
  import MultiFieldFormModal from "./MultiFieldFormModal.svelte";
  import yup from "./forms/yup";
  import commonSchema from "./forms/commonSchema";
  import Field from "./forms/Field.svelte";
  import TextInput from "./forms/TextInput.svelte";
  import SelectInput from "./forms/SelectInput.svelte";
  import prettifyRole from "../utilities/prettifyRole";
  import Button from "./forms/Button.svelte";
  import ErrorMessages from "./forms/ErrorMessages.svelte";
  import getCommonToastOptions from "./utilities/getCommonToastOptions";
  import requestApi from "../api/requestApi";

  let email = "";
  let jobTitle = "";
  let name = "";
  function onFormReset() {
    email = "";
    jobTitle = "";
    name = "";
  }

  const selectedRole = writable<"standard" | "admin">("standard");

  const handleOnSubmit = async () => {
    await requestApi("userorganizations/request_invite", {
      body: {
        email,
        jobTitle,
        name,
        role: $selectedRole,
      },
      isNotJSONAPI: true,
      method: "POST",
    });

    toast.success("User invited!", getCommonToastOptions());
  };
</script>

<MultiFieldFormModal
  description="NOTE: invite emails can take up to a day or two to arrive. There is a manual step involved."
  schema={yup.object({
    email: commonSchema.email().label("Email"),
    jobTitle: yup.string().label("jobTitle"),
    name: yup.string().label("Full name").required(),
    role: yup.string().label("Role").required(),
  })}
  on:formReset={onFormReset}
  onSubmit={handleOnSubmit}
  title="Invite"
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
      labelText="Email"
      name="email"
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      theme="dark"
    >
      <TextInput
        aria-describedby={ariaDescribedby}
        bind:value={email}
        class={_class}
        name={_name}
        {id}
        required
        {theme}
        type="email"
      />
    </Field>

    <Field
      {form}
      labelText="Full name"
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
        bind:value={name}
        class={_class}
        name={_name}
        {id}
        {theme}
        required
        type="text"
      />
    </Field>

    <Field
      {form}
      labelText="Role"
      name="role"
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      theme="dark"
    >
      <SelectInput
        aria-describedby={ariaDescribedby}
        bind:value={$selectedRole}
        class={_class}
        name={_name}
        {id}
        options={["admin", "standard"].map((role) => ({
          label: prettifyRole(role),
          value: role,
        }))}
        required
        {theme}
      />
    </Field>

    <Field
      {form}
      labelText="Job title"
      name="jobTitle"
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      theme="dark"
    >
      <TextInput
        aria-describedby={ariaDescribedby}
        bind:value={jobTitle}
        class={_class}
        name={_name}
        {id}
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
      variant="primary">Send invite</Button
    >
  </svelte:fragment>
</MultiFieldFormModal>

<style>
</style>

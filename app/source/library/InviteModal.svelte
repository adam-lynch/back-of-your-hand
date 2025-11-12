<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
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
  import { organization } from "../userData/store";
  import type {
    OmitTimestampedResourceAttributes,
    UserOrganization,
  } from "../api/resourceObjects";

  let email = "";
  let firstName = "";
  let jobTitle = "";
  let lastName = "";
  function onFormReset() {
    email = "";
    firstName = "";
    jobTitle = "";
    lastName = "";
  }

  const selectedRole = writable<"standard" | "admin">("standard");

  const dispatch = createEventDispatcher();

  const handleOnSubmit = async () => {
    if (!$organization) {
      throw new Error("No organization");
    }

    const userOrganization: Omit<
      OmitTimestampedResourceAttributes<UserOrganization>,
      "id"
    > = {
      attributes: {
        inviteUserEmail: email,
        inviteUserFirstName: firstName,
        inviteUserLastName: lastName,
        jobTitle,
        role: $selectedRole,
      },
      relationships: {
        organization: {
          data: {
            id: $organization.id,
            type: "organization",
          },
        },
        user: {
          data: null,
        },
      },
      type: "userOrganization",
    };

    await requestApi("userorganizations/actions/invite", {
      body: {
        data: userOrganization,
      },
      method: "POST",
    });

    dispatch("invited");

    toast.success("User invited!", getCommonToastOptions());
  };
</script>

<MultiFieldFormModal
  decideIfGeneralErrorsAreUnexpected={(errorMessages) =>
    !errorMessages.every((errorMessage) =>
      errorMessage.includes("already exists"),
    )}
  schema={yup.object({
    email: commonSchema.email().label("Email"),
    firstName: yup.string().label("First name").required(),
    jobTitle: yup.string().label("Job title"),
    lastName: yup.string().label("Last name").required(),
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
        {id}
        name={_name}
        required
        {theme}
        type="email"
      />
    </Field>

    <Field
      {form}
      labelText="First name"
      name="firstName"
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      theme="dark"
    >
      <TextInput
        aria-describedby={ariaDescribedby}
        bind:value={firstName}
        class={_class}
        {id}
        name={_name}
        {theme}
        required
        type="text"
      />
    </Field>

    <Field
      {form}
      labelText="Last name"
      name="lastName"
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      theme="dark"
    >
      <TextInput
        aria-describedby={ariaDescribedby}
        bind:value={lastName}
        class={_class}
        {id}
        name={_name}
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
        {id}
        name={_name}
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
        {id}
        name={_name}
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

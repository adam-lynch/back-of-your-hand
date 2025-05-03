<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import toast from "svelte-french-toast";
  import MultiFieldFormModal from "./MultiFieldFormModal.svelte";
  import yup from "./forms/yup";
  import commonSchema from "./forms/commonSchema";
  import Field from "./forms/Field.svelte";
  import TextInput from "./forms/TextInput.svelte";
  import Button from "./forms/Button.svelte";
  import ErrorMessages from "./forms/ErrorMessages.svelte";
  import getCommonToastOptions from "./utilities/getCommonToastOptions";
  import requestApi from "../api/requestApi";

  let email = "";
  let name = "";
  let organization = "";

  function onFormReset() {
    email = "";
    name = "";
    organization = "";
  }

  const handleOnSubmit = async () => {
    try {
      await requestApi("request_organization_access", {
        body: {
          email,
          name,
          organization,
          url: window.location.href,
          userAgent: navigator.userAgent,
          userAgentData:
            "userAgentData" in navigator ? navigator.userAgentData : null,
        },
        isNotJSONAPI: true,
        method: "POST",
        urlPrefix: "open",
      });
    } catch (e) {
      console.error(e);
      throw e;
    }

    toast.success("Access requested!", getCommonToastOptions());
  };
</script>

<MultiFieldFormModal
  on:formReset={onFormReset}
  schema={yup.object({
    email: commonSchema.email().label("Email").required(),
    name: yup.string().label("Name").required(),
    organization: yup.string().label("Department / organization").required(),
  })}
  onSubmit={handleOnSubmit}
  title="Train on your real response area"
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

  <div
    class="pro-plan-modal__description"
    slot="content-top"
  >
    <p>Want to use a custom-shaped map instead of a circle?</p>
    <p
      >We can build a tailored version for your department using your exact
      response area.</p
    >
    <ul>
      <li>✅ Matches your real district boundaries.</li>
      <li>✅ Break it into zones for training.</li>
      <li>✅ Track staff progress over time.</li>
      <li>✅ Add your logo, users, stats & more.</li>
    </ul>
  </div>

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
        autocomplete="name"
        bind:value={name}
        class={_class}
        name={_name}
        {id}
        required
        {theme}
        type="text"
      />
    </Field>

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
        autocomplete="email"
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
      labelText="Department / organization"
      name="organization"
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      theme="dark"
    >
      <TextInput
        aria-describedby={ariaDescribedby}
        bind:value={organization}
        class={_class}
        name={_name}
        {id}
        required
        {theme}
        type="text"
      />
    </Field>

    <p class="pro-plan-modal__disclaimer"
      >🔒 We'll only use this info to contact you about access. No spam.</p
    >

    <ErrorMessages messages={generalErrorMessages} />
  </svelte:fragment>

  <svelte:fragment
    slot="footer"
    let:closeModal
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
      theme="dark"
      type="submit"
      variant="primary">Request access</Button
    >
  </svelte:fragment>
</MultiFieldFormModal>

<style>
  .pro-plan-modal__description {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .pro-plan-modal__disclaimer {
    opacity: 0.9;
    font-size: 12px;
    margin-bottom: 0.75rem;
  }
</style>

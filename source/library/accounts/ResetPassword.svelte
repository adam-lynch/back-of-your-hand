<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import confirmPasswordReset from "../../userData/confirmPasswordReset";
  import Button from "../forms/Button.svelte";
  import Field from "../forms/Field.svelte";
  import Link from "../Link.svelte";
  import TextInput from "../forms/TextInput.svelte";
  import getInternalRoutes from "../routing/getInternalRoutes";
  import AccountsFormPage from "./AccountsFormPage.svelte";
  import yup from "../forms/yup";
  import commonSchema from "../forms/commonSchema";

  const internalRoutes = getInternalRoutes();

  let hasBeenReset = false;

  let password1 = "";
  let password2 = "";
  let token = "";
  let userId = "";

  onMount(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    token = urlSearchParams.get("token") || "";
    userId = urlSearchParams.get("uid") || "";
  });

  async function onSubmit() {
    await confirmPasswordReset({
      password: password1,
      token,
      userId,
    });
    hasBeenReset = true;
  }
</script>

<AccountsFormPage
  internalRoute={internalRoutes.confirmPasswordReset}
  {onSubmit}
  schema={yup.object({
    password1: commonSchema.newPassword().label("New password"),
    password2: yup
      .string()
      .oneOf([yup.ref("password1"), ""], "Passwords must match")
      .required("Please confirm your new password")
      .label("Confirm New Password"),
  })}
  shouldRedirectIfUserExists={false}
>
  <svelte:fragment slot="top">
    {#if hasBeenReset}
      <p
        >Your password has been reset. <Link to={internalRoutes.logIn.path}
          >Log in</Link
        ></p
      >
    {/if}
  </svelte:fragment>

  <svelte:fragment
    slot="fields"
    let:form
  >
    {#if !hasBeenReset}
      <Field
        autofocus
        {form}
        labelText="New password"
        let:_class
        let:_name
        let:ariaDescribedby
        let:id
        let:theme
        name="password1"
      >
        <TextInput
          aria-describedby={ariaDescribedby}
          autocomplete="new-password"
          autofocus
          bind:value={password1}
          class={_class}
          {id}
          name={_name}
          required
          {theme}
          type="password"
        />
      </Field>
      <Field
        {form}
        labelText="Confirm new password"
        let:_class
        let:_name
        let:ariaDescribedby
        let:id
        let:theme
        name="password2"
        required
      >
        <TextInput
          aria-describedby={ariaDescribedby}
          autocomplete="new-password"
          bind:value={password2}
          class={_class}
          {id}
          name={_name}
          required
          {theme}
          type="password"
        />
      </Field>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="accounts-form-footer">
    {#if !hasBeenReset}
      <Button type="submit">Reset password</Button>

      <Link to={internalRoutes.logIn.path}>Log in instead</Link>
    {/if}
  </svelte:fragment>
</AccountsFormPage>

<style>
</style>

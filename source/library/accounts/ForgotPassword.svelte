<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { writable } from "svelte/store";
  import requestPasswordReset from "../../userData/requestPasswordReset";
  import Button from "../forms/Button.svelte";
  import Field from "../forms/Field.svelte";
  import Link from "../Link.svelte";
  import TextInput from "../forms/TextInput.svelte";
  import getInternalRoutes from "../routing/getInternalRoutes";
  import AccountsFormPage from "./AccountsFormPage.svelte";
  import yup from "../forms/yup";
  import commonSchema from "../forms/commonSchema";

  const internalRoutes = getInternalRoutes();

  let email = "";
  let wasResetRequested = writable(false);

  async function onSubmit() {
    await requestPasswordReset(email);
    wasResetRequested.set(true);
  }

  function reset() {
    email = "";
    wasResetRequested.set(false);
  }
</script>

<AccountsFormPage
  internalRoute={internalRoutes.forgotPassword}
  {onSubmit}
  schema={yup.object({
    email: commonSchema.email().label("Email"),
  })}
>
  <svelte:fragment slot="top">
    {#if $wasResetRequested}
      <p
        >If the email you entered (<span class="forgot-password__email"
          >{email}</span
        >) corresponds to an account, we've sent password reset instructions to
        that address. Check your inbox.</p
      >
    {/if}
  </svelte:fragment>

  <svelte:fragment
    slot="fields"
    let:form
  >
    {#if !$wasResetRequested}
      <Field
        {form}
        labelText="Email"
        let:_class
        let:_name
        let:ariaDescribedby
        let:id
        let:theme
        name="email"
      >
        <TextInput
          aria-describedby={ariaDescribedby}
          autocomplete="email"
          autofocus
          bind:value={email}
          class={_class}
          {id}
          name={_name}
          required
          {theme}
          type="email"
        />
      </Field>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="accounts-form-footer">
    {#if $wasResetRequested}
      <Button
        on:click={reset}
        size="small"
      >
        Enter a different email address
      </Button>
    {:else}
      <Button type="submit">Reset password</Button>

      <!-- TODO: Pass email -->
      <Link to={internalRoutes.logIn.path}>Log in instead</Link>
    {/if}
  </svelte:fragment>
</AccountsFormPage>

<style>
  :global(.forgot-password__email) {
    opacity: 0.8;
  }
</style>

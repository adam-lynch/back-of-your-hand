<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import toast from "svelte-french-toast";
  import Button from "../forms/Button.svelte";
  import Field from "../forms/Field.svelte";
  import Link from "../Link.svelte";
  import TextInput from "../forms/TextInput.svelte";
  import getInternalRoutes from "../routing/getInternalRoutes";
  import AccountsFormPage from "./AccountsFormPage.svelte";
  import authController from "../../userData/authController";
  import yup from "../forms/yup";
  import { ClientRequestError } from "../../api/requestApi";
  import getCommonToastOptions from "../utilities/getCommonToastOptions";

  const internalRoutes = getInternalRoutes();

  let email = "";
  let password = "";
  let topLevelErrorMessage = "";

  function decideIfErrorShouldBeReported(error: unknown) {
    return !(
      error instanceof ClientRequestError &&
      error.responseBody?.errors.length === 1 &&
      error.responseBody.errors[0].detail?.includes("credentials")
    );
  }

  function decideIfGeneralErrorsAreUnexpected(errorMessages: string[]) {
    return !(
      errorMessages.length === 1 && errorMessages[0].includes("credentials")
    );
  }

  async function onSubmit() {
    topLevelErrorMessage = "";

    await authController.logIn({
      email,
      password,
    });

    // TODO: continue param
    navigate("/", { replace: false });
  }

  onMount(() => {
    if (window.history.state?.didSessionExpire) {
      toast.error("Session expired!", getCommonToastOptions());
    }
  });
</script>

<AccountsFormPage
  {decideIfErrorShouldBeReported}
  {decideIfGeneralErrorsAreUnexpected}
  internalRoute={internalRoutes.logIn}
  {onSubmit}
  schema={yup.object({
    email: yup.string().label("Email").email().required(),
    password: yup.string().label("Password").required(),
  })}
  {topLevelErrorMessage}
>
  <svelte:fragment
    slot="fields"
    let:form
  >
    <Field
      labelText="Email"
      {form}
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

    <Field
      labelText="Password"
      {form}
      let:_class
      let:_name
      let:ariaDescribedby
      let:id
      let:theme
      name="password"
    >
      <TextInput
        aria-describedby={ariaDescribedby}
        autocomplete="current-password"
        bind:value={password}
        class={_class}
        {id}
        name={_name}
        required
        {theme}
        type="password"
      />
    </Field>
  </svelte:fragment>

  <svelte:fragment slot="accounts-form-footer">
    <!-- TODO: Pass email -->
    <Link to={internalRoutes.forgotPassword.path}>Forgot password?</Link>
    <Button type="submit">Log in</Button>
  </svelte:fragment>
</AccountsFormPage>

<style>
</style>

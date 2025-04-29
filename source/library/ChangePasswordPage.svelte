<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import toast from "svelte-french-toast";
  import { navigate } from "svelte-routing";
  import requestAuthEndpoint from "../api/requestAuthEndpoint";
  import SettingsPage from "./SettingsPage.svelte";
  import { user, userOrganization } from "../userData/store";
  import Link from "./Link.svelte";
  import Button from "./forms/Button.svelte";
  import * as svelteStore from "svelte/store";
  import getInternalRoutes from "./routing/getInternalRoutes";
  import yup from "./forms/yup";
  import commonSchema from "./forms/commonSchema";
  import MultiFieldForm from "./forms/MultiFieldForm.svelte";
  import ErrorMessages from "./forms/ErrorMessages.svelte";
  import Field from "./forms/Field.svelte";
  import TextInput from "./forms/TextInput.svelte";
  import getCommonToastOptions from "./utilities/getCommonToastOptions";
  import { ClientRequestError } from "../api/requestApi";

  const internalRoutes = getInternalRoutes();
  const internalRouteId = "changePassword";
  const internalRoute = internalRoutes[internalRouteId];

  let oldPassword = "";
  let newPassword1 = "";
  let newPassword2 = "";

  const schema = yup.object({
    oldPassword: yup.string().required().label("Current password"),
    newPassword1: commonSchema.newPassword().label("New password"),
    newPassword2: yup
      .string()
      .oneOf([yup.ref("newPassword1"), ""], "New passwords must match")
      .required("Please confirm your new password")
      .label("Confirm New Password"),
  });

  async function onSubmit() {
    toast.success("Password updated!", getCommonToastOptions());
    await requestAuthEndpoint("password/change", {
      body: {
        old_password: oldPassword,
        new_password1: newPassword1,
        new_password2: newPassword2,
      },
      method: "POST",
    });

    navigate(internalRoutes.profile.path, { replace: false });
  }

  function decideIfErrorShouldBeReported(error: unknown): boolean {
    return !(
      error instanceof ClientRequestError &&
      error.responseBody?.errors.length === 1 &&
      error.responseBody.errors[0].detail?.includes(
        "password was entered incorrectly",
      )
    );
  }
</script>

<SettingsPage
  customTitleStore={svelteStore.writable(internalRoute.title)}
  {internalRouteId}
>
  {#if $user && $userOrganization}
    <div class="change-password-page__inner">
      <MultiFieldForm
        action="#"
        class="change-password-page__form"
        let:form
        let:generalErrorMessages
        {decideIfErrorShouldBeReported}
        {onSubmit}
        {schema}
      >
        <!-- Hidden field to help password managers -->
        <Field
          class="hide-accessibly"
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
            bind:value={$user.attributes.email}
            class={_class}
            disabled
            {id}
            name={_name}
            required
            {theme}
            type="email"
          />
        </Field>

        <Field
          class="change-password-page__first-visible-field"
          {form}
          labelText="Current password"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          let:theme
          name="oldPassword"
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            autocomplete="current-password"
            autofocus
            bind:value={oldPassword}
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
          labelText="New password"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          let:theme
          name="newPassword1"
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            autocomplete="new-password"
            bind:value={newPassword1}
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
          name="newPassword2"
          required
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            autocomplete="new-password"
            bind:value={newPassword2}
            class={_class}
            {id}
            name={_name}
            required
            {theme}
            type="password"
          />
        </Field>

        <ErrorMessages messages={generalErrorMessages} />

        <footer
          class="change-password-page__footer"
          let:isSubmitting
        >
          <Link
            styleLevel="all-except-current-related"
            to={internalRoutes.profile.path}>Cancel</Link
          >

          <Button
            disabled={isSubmitting}
            type="submit"
          >
            Update password
          </Button>
        </footer>
      </MultiFieldForm>
    </div>
  {/if}
</SettingsPage>

<style>
  .change-password-page__inner {
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
    max-width: 500px;
  }

  .change-password-page__footer {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
  }
</style>

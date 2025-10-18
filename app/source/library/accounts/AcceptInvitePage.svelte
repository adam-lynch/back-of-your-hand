<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { derived, writable } from "svelte/store";
  import { navigate } from "svelte-routing";
  import Button from "../forms/Button.svelte";
  import Field from "../forms/Field.svelte";
  import Link from "../Link.svelte";
  import TextInput from "../forms/TextInput.svelte";
  import getInternalRoutes from "../routing/getInternalRoutes";
  import AccountsFormPage from "./AccountsFormPage.svelte";
  import yup from "../forms/yup";
  import commonSchema from "../forms/commonSchema";
  import { organization } from "../../userData/store";
  import type { AccessDetailsAttributes } from "../../userData/store";
  import authController from "../../userData/authController";
  import api from "../../api";
  import * as JSONAPI from "../../api/JSONAPI";
  import CheckboxInput from "../forms/CheckboxInput.svelte";
  import type { UserOrganization } from "../../api/resourceObjects";
  import { ClientRequestError } from "../../api/requestApi";

  // TODO: revise class names

  const pageStatusOptions = [
    "already-accepted",
    "does-not-exist",
    "expired",
    "joinable-as-is",
    "loading",
    "must-sign-up",
    "wrong-user-organization",
  ] as const;
  type PageStatus = (typeof pageStatusOptions)[number];

  const internalRoutes = getInternalRoutes();

  let pageStatus = writable<PageStatus>("loading");
  let inPageTitle = derived(
    [pageStatus, organization],
    ([$pageStatus, $organization]) => {
      const organizationJoinText = $organization
        ? `Join ${$organization.attributes.name}`
        : "Accept invite";
      const mapping: Record<PageStatus, string | null> = {
        "already-accepted": "Uh oh",
        "does-not-exist": "Invalid",
        expired: "Invite expired",
        "joinable-as-is": organizationJoinText,
        loading: "Loading...",
        "must-sign-up": organizationJoinText,
        "wrong-user-organization": "Invite for another user",
      };
      return mapping[$pageStatus];
    },
  );

  let userOrganizationId = "";

  // form fields data
  let isAgreeingWithComplianceDocuments = false;
  let password1 = "abcdef123"; // TODO
  let password2 = "abcdef123"; // TODO
  let token = "";

  onMount(async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    token = urlSearchParams.get("token") || "";
    let resultPageStatus: PageStatus = "must-sign-up";

    if (Math.random() > -1) {
      pageStatus.set(resultPageStatus);
      return;
    }

    try {
      const response: JSONAPI.DocWithData<
        Omit<UserOrganization, "attributes" | "relationships"> & {
          relationships: Pick<
            NonNullable<UserOrganization["relationships"]>,
            "user"
          >;
        }
      > = await api.requestApi(`/invited-userorganizations/${token}`, {});
      userOrganizationId = response.data.id;
      if (response.data.relationships.user) {
        resultPageStatus = "joinable-as-is";
      }
    } catch (error) {
      if (
        error instanceof ClientRequestError &&
        error.responseBody?.errors.length &&
        error.responseBody.errors[0].code &&
        pageStatusOptions.includes(
          error.responseBody.errors[0].code as PageStatus,
        )
      ) {
        resultPageStatus = error.responseBody.errors[0].code as PageStatus;
        return;
      }

      throw error;
    }

    pageStatus.set(resultPageStatus);
  });

  async function onSubmit() {
    const response: JSONAPI.DocWithData<
      JSONAPI.ResourceObject<"InviteAcceptance", AccessDetailsAttributes>
    > = await api.requestApi(
      `/userorganizations/${userOrganizationId}/accept-invite`,
      {
        body: {
          token,
        },
        method: "POST",
      },
    );

    authController.setAccessDetails(response.data.attributes);
    navigate("/", { replace: false });
  }
</script>

<AccountsFormPage
  internalRoute={internalRoutes.acceptInvite}
  {onSubmit}
  schema={yup.object({
    compliance: commonSchema
      .checkbox(true, "You must agree to the Terms of Service")
      .label("I accept the Terms of Service"),
    password1: commonSchema.newPassword().label("Password"),
    password2: yup
      .string()
      .oneOf([yup.ref("password1"), ""], "Passwords must match")
      .required("Please confirm your password")
      .label("Confirm Password"),
  })}
  titleOverride={$inPageTitle}
  shouldRedirectIfUserExists={false}
>
  <svelte:fragment slot="top">
    {#if $pageStatus === "already-accepted"}
      <p>This invite has already been accepted.</p>
      <Link
        class="accept-invite__link-cta"
        to={internalRoutes.logIn.path}>Login</Link
      >
    {:else if $pageStatus === "does-not-exist"}
      <p>No such invite exists. It may have been revoked.</p>
    {:else if $pageStatus === "expired"}
      <p>Ask your administrator to resend the invite.</p>
    {:else if $pageStatus === "wrong-user-organization"}
      <p>You are already signed in as a different user.</p>
      <Link
        class="accept-invite__link-cta"
        to={internalRoutes.game.path}>Close</Link
      >
    {/if}
  </svelte:fragment>

  <svelte:fragment
    slot="fields"
    let:form
  >
    {#if $pageStatus === "must-sign-up"}
      <Field
        autofocus
        {form}
        labelText="Password"
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
        labelText="Confirm password"
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
      <Field
        {form}
        labelText=""
        let:_class
        let:_name
        let:ariaDescribedby
        let:id
        let:theme
        mustPutControlFirst
        name="compliance"
        required
      >
        <svelte:fragment slot="label">
          I accept the <Link
            class="accept-invite__compliance-link"
            isExternal
            to="/terms-of-service">Terms of Service</Link
          >
        </svelte:fragment>

        <CheckboxInput
          aria-describedby={ariaDescribedby}
          bind:checked={isAgreeingWithComplianceDocuments}
          class={_class}
          {id}
          name={_name}
          required
          {theme}
        />
      </Field>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="accounts-form-footer">
    {#if ["joinable-as-is", "must-sign-up"].includes($pageStatus)}
      <Button type="submit"
        >{#if $pageStatus === "joinable-as-is"}Accept invite{:else}Create
          account and join{/if}</Button
      >
    {/if}
  </svelte:fragment>
</AccountsFormPage>

<style>
  :global(.confirm-description) {
    color: #c3c3c3;
  }

  :global(.accept-invite__link-cta) {
    display: block;
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
    color: white;
  }

  :global(.accept-invite__compliance-link) {
    text-decoration: underline;
    text-decoration-color: gray;
    text-underline-offset: 2px;
  }
</style>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { navigate } from "svelte-routing";
  import EnvelopeIcon from "~icons/solar/letter-line-duotone";

  import SettingsPage from "./SettingsPage.svelte";
  import AutoSavingTextField from "./forms/autoSavingFields/AutoSavingTextField.svelte";
  import AutoSavingSelectField from "./forms/autoSavingFields/AutoSavingSelectField.svelte";
  import {
    user as currentUser,
    userOrganizationIsAdmin,
  } from "../userData/store";
  import Link from "./Link.svelte";
  import Button from "./forms/Button.svelte";
  import prettifyRole from "../utilities/prettifyRole";
  import type { User, UserOrganization } from "../api/resourceObjects";
  import * as svelteStore from "svelte/store";
  import prettifyUserOrganizationName from "../utilities/prettifyUserOrganizationName";
  import DeleteUserConfirmationModal from "./DeleteUserOrganizationConfirmationModal.svelte";
  import getInternalRoutes from "./routing/getInternalRoutes";
  import yup from "./forms/yup";
  import commonSchema from "./forms/commonSchema";
  import fetchUserOrganizationWithAllIncludes from "../userData/fetchUserOrganizationWithAllIncludes";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import { ClientRequestError } from "../api/requestApi";
  import prettifyUserOrganizationInviteStatus from "../utilities/prettifyUserOrganizationInviteStatus";
  import getCommonToastOptions from "./utilities/getCommonToastOptions";
  import Field from "./forms/Field.svelte";
  import TextInput from "./forms/TextInput.svelte";
  import prettifyDate from "./utilities/prettifyDate";
  import api from "../api";
  import { reportError } from "../utilities/setUpErrorReporting";

  export let internalRouteId = "user";
  export let routePathParameters: {
    userOrganizationId: string;
  };
  export let userStore = svelteStore.writable<User | null>(null);
  export let userOrganizationStore =
    svelteStore.writable<UserOrganization | null>(null);

  const isCurrentUser = svelteStore.derived(
    [currentUser, userStore],
    ([$currentUser, $userStore]) =>
      $userStore && $userStore.id === $currentUser?.id,
  );

  const internalRoutes = getInternalRoutes();

  const onDeletionConfirmed = ({
    isCurrentUser,
  }: {
    isCurrentUser: boolean;
  }) => {
    if (isCurrentUser) {
      navigate(internalRoutes.accountDeleted.path, { replace: false });
      return;
    }
    navigate(internalRoutes.users.path, { replace: false });
  };

  const customTitleStore = svelteStore.derived(
    [userOrganizationStore, userStore],
    ([$userOrganization, $user]) => {
      if (internalRouteId === "profile" || !$userOrganization) {
        return null;
      }

      let result = prettifyUserOrganizationName($userOrganization, $user);

      const { labelText, statusId } =
        prettifyUserOrganizationInviteStatus($userOrganization);
      if (labelText) {
        result += `<span class="hide-accessibly">(</span>
          <span class="user-page__invite-status-label user-page__invite-status-label--${statusId}">${labelText}</span>
          <span class="hide-accessibly">(</span>`;
      }

      return result;
    },
  );

  const did404 = svelteStore.writable(false);

  onMount(async () => {
    try {
      const userData = await fetchUserOrganizationWithAllIncludes(
        routePathParameters.userOrganizationId,
      );
      userStore.set(userData.user);
      userOrganizationStore.set(userData.userOrganization);
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

  async function resendInvite() {
    try {
      if (!$userOrganizationStore) {
        throw new Error("No userOrganization");
      }

      const response: { data: UserOrganization } = await api.requestApi(
        `userorganizations/${$userOrganizationStore.id}/actions/issue-invite`,
        {
          method: "POST",
        },
      );
      userOrganizationStore.set(response.data);
    } catch (error) {
      reportError(error);

      let errorMessage = "Error occurred while sending invite email";
      if (
        error instanceof ClientRequestError &&
        error.responseBody?.errors.length &&
        error.responseBody.errors[0].detail
      ) {
        errorMessage += `. Detail: ${error.responseBody?.errors[0].detail}`;
      }
      toast.error(errorMessage, getCommonToastOptions());
      return;
    }

    toast.success("Invite email sent!", getCommonToastOptions());
  }
</script>

<SettingsPage
  {customTitleStore}
  {internalRouteId}
>
  {#if $did404}
    <p>User not found</p>
  {:else if $userOrganizationStore}
    <div class="user-page__inner">
      <AutoSavingTextField
        fieldProps={{
          labelText: "Email",
        }}
        schema={commonSchema.email()}
        shouldPatchResourceOnWritableUpdated={true}
        textProps={{
          readonly: true,
          required: true,
          type: "email",
        }}
        writable={$userOrganizationStore.attributes.inviteStatus === "accepted"
          ? userStore
          : userOrganizationStore}
        writableSelector={$userOrganizationStore.attributes.inviteStatus ===
        "accepted"
          ? "attributes.email"
          : "attributes.inviteUserEmail"}
      />
      <AutoSavingTextField
        fieldProps={{
          labelText: "First name",
        }}
        schema={yup.string().required()}
        shouldPatchResourceOnWritableUpdated={true}
        textProps={{
          autofocus: true,
          autocomplete: "given-name",
          required: true,
        }}
        writable={$userOrganizationStore.attributes.inviteStatus === "accepted"
          ? userStore
          : userOrganizationStore}
        writableSelector={$userOrganizationStore.attributes.inviteStatus ===
        "accepted"
          ? "attributes.firstName"
          : "attributes.inviteUserFirstName"}
      />
      <AutoSavingTextField
        fieldProps={{
          labelText: "Last name",
        }}
        schema={yup.string().required()}
        shouldPatchResourceOnWritableUpdated={true}
        textProps={{
          autocomplete: "surname",
          required: true,
        }}
        writable={$userOrganizationStore.attributes.inviteStatus === "accepted"
          ? userStore
          : userOrganizationStore}
        writableSelector={$userOrganizationStore.attributes.inviteStatus ===
        "accepted"
          ? "attributes.lastName"
          : "attributes.inviteUserLastName"}
      />
      <AutoSavingTextField
        fieldProps={{
          labelText: "Job title",
        }}
        schema={yup.string()}
        shouldPatchResourceOnWritableUpdated={true}
        textProps={{
          autocomplete: "organization-title",
        }}
        writable={userOrganizationStore}
        writableSelector={"attributes.jobTitle"}
      />
      <AutoSavingSelectField
        fieldProps={{
          labelText: "Role",
        }}
        schema={yup.string().required()}
        selectProps={{
          disabled: !$userOrganizationIsAdmin || $isCurrentUser,
          options: ["admin", "standard"].map((role) => ({
            label: prettifyRole(role),
            value: role,
          })),
          required: true,
        }}
        shouldPatchResourceOnWritableUpdated={true}
        writable={userOrganizationStore}
        writableSelector={"attributes.role"}
      />

      {#if $userOrganizationStore.attributes.inviteStatus !== "accepted"}
        <Field
          disabled
          form={null}
          labelText="Most recent invite email"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          name="invited-at"
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            class={_class}
            disabled
            {id}
            name={_name}
            value={$userOrganizationStore.attributes.inviteIssuedAt
              ? prettifyDate($userOrganizationStore.attributes.inviteIssuedAt)
              : ""}
          />
        </Field>
      {/if}

      <div class="user-page__actions">
        {#if $isCurrentUser}
          <Link to={internalRoutes.changePassword.path}>Change Password</Link>
        {/if}

        {#if $userOrganizationStore.attributes.inviteStatus !== "accepted"}
          <Button
            Icon={EnvelopeIcon}
            on:click={resendInvite}
            variant={prettifyUserOrganizationInviteStatus(
              $userOrganizationStore,
            ).statusId === "expired"
              ? "primary"
              : undefined}>Resend invite</Button
          >
        {/if}

        <DeleteUserConfirmationModal
          onConfirm={onDeletionConfirmed}
          user={$userStore}
          userOrganization={$userOrganizationStore}
        >
          <Button
            slot="trigger"
            let:builder
            builders={[builder]}
            consequence="destruction"
          >
            Delete account
          </Button>
        </DeleteUserConfirmationModal>
      </div>
    </div>
  {:else}
    <LoadingIndicator />
  {/if}
</SettingsPage>

<style>
  .user-page__inner {
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
    max-width: 500px;
  }

  .user-page__actions {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    margin-top: 1.5rem;
  }

  :global(.user-page__invite-status-label) {
    margin-left: 0.5rem;
    padding: 0.2rem;
    background: white;
    color: black;
    opacity: 0.8;
    border-radius: 5px;
    font-size: 1rem;
    line-height: 1;
    vertical-align: middle;
  }

  :global(.user-page__invite-status-label--expired) {
    background: #fdb2b2;
  }
</style>

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
      if (internalRouteId === "profile" || !$userOrganization || !$user) {
        return null;
      }
      return prettifyUserOrganizationName($userOrganization, $user);
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
</script>

<SettingsPage
  {customTitleStore}
  {internalRouteId}
>
  {#if $did404}
    <p>User not found</p>
  {:else if $userStore && $userOrganizationStore}
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
        writable={userStore}
        writableSelector={"attributes.email"}
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
        writable={userStore}
        writableSelector={"attributes.firstName"}
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
        writable={userStore}
        writableSelector={"attributes.lastName"}
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

      <div class="user-page__actions">
        {#if $isCurrentUser}
          <Link to={internalRoutes.changePassword.path}>Change Password</Link>
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
            consequence="destruction">Delete account</Button
          >
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
</style>

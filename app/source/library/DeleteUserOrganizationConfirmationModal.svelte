<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { derived } from "svelte/store";
  import toast from "svelte-french-toast";
  import type { User, UserOrganization } from "../api/resourceObjects";
  import prettifyUserOrganizationName from "../utilities/prettifyUserOrganizationName";
  import ConfirmationModal from "./ConfirmationModal.svelte";
  import { user as currentUser } from "../userData/store";
  import api from "../api";
  import eventEmitter from "../utilities/eventEmitter";
  import getCommonToastOptions from "./utilities/getCommonToastOptions";

  export let onConfirm: (data: {
    isCurrentUser: boolean;
    userOrganizationId: string;
  }) => void = () => {};
  export let user: User | null;
  export let userOrganization: UserOrganization;

  let isCurrentUser = derived(currentUser, ($currentUser) =>
    $currentUser && user ? $currentUser.id === user.id : false,
  );

  const title = `Delete ${$isCurrentUser ? "your account" : prettifyUserOrganizationName(userOrganization, user)}?`;

  const handleConfirm = async () => {
    const userOrganizationId = userOrganization.id;
    onConfirm({
      isCurrentUser: $isCurrentUser,
      userOrganizationId: userOrganization.id,
    });
    await api.deleteResource<UserOrganization>(
      "userOrganization",
      userOrganizationId,
    );
    eventEmitter.emit("user-organization-deleted", {
      isCurrentUser: $isCurrentUser,
      userOrganizationId,
    });
    toast.success("User deleted!", getCommonToastOptions());
  };
</script>

<ConfirmationModal
  description="All related data will no longer be accessible. This cannot be undone."
  onConfirm={handleConfirm}
  {title}
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
</ConfirmationModal>

<style>
</style>

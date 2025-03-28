<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import AdminIcon from "~icons/mdi/security-account";
  import InviteIcon from "~icons/mdi/add";
  import UserIcon from "~icons/mdi/user";
  import Button from "./forms/Button.svelte";
  import SettingsPage from "./SettingsPage.svelte";
  import prettifyRole from "../utilities/prettifyRole";
  import Link from "./Link.svelte";
  import getInternalRoutes from "./routing/getInternalRoutes";
  import replacePathParameters from "./routing/replacePathParameters";
  import DeleteUserConfirmationModal from "./DeleteUserConfirmationModal.svelte";
  import eventEmitter from "../utilities/eventEmitter";
  import type { User, UserOrganization } from "../api/resourceObjects";
  import ResourceListInfiniteScrollTable from "./ResourceListInfiniteScrollTable.svelte";
  import type { FetchResourceListOptions } from "../api";
  import api from "../api";
  import prettifyUserName from "../utilities/prettifyUserName";
  import * as svelteStore from "svelte/store";
  import userOrganizationsSort from "./utilities/userOrganizationsSort";
  import InviteModal from "./InviteModal.svelte";
  import combineClasses from "./utilities/combineClasses";
  import { navigate } from "svelte-routing";
  import getClosestElement from "../utilities/getClosestElement";
  import { userOrganization } from "../userData/store";

  type UserOrganizationWithRelationships = UserOrganization & {
    relationships: {
      user: {
        data: User;
      };
    };
  };

  const internalRoutes = getInternalRoutes();
  const userIdsToExcludeWritable = svelteStore.writable<
    UserOrganization["id"][]
  >([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const castRowData = (input: any) =>
    input as unknown as UserOrganizationWithRelationships;

  function makeUserPageLink(rowData: Record<string, unknown>) {
    const userOrganizationId = castRowData(rowData).id;
    if (userOrganizationId === $userOrganization?.id) {
      return internalRoutes.profile.path;
    }

    return replacePathParameters(internalRoutes.user.path, {
      userOrganizationId,
    });
  }

  const onClickBodyRow = (
    event: MouseEvent,
    rowData: Record<string, unknown>,
  ) => {
    const closestElement = getClosestElement(event.target);
    if (!closestElement || closestElement.closest("a, button")) {
      return;
    }
    navigate(makeUserPageLink(rowData));
  };

  const onUserDeleted = (userId: string) => {
    if (!svelteStore.get(userIdsToExcludeWritable).includes(userId)) {
      userIdsToExcludeWritable.update((old) => [...old, userId]);
    }
  };

  const onUserDeletionConfirmed = (user: User) => {
    onUserDeleted(user.id);
  };

  onMount(() => {
    eventEmitter.on("user-deleted", onUserDeleted);

    return () => {
      eventEmitter.off("user-deleted", onUserDeleted);
    };
  });

  const fetchResourceList = (options: FetchResourceListOptions) =>
    api.fetchResourceList<UserOrganization>("userOrganization", {
      ...options,
      include: ["user"],
      sort: userOrganizationsSort,
    });

  const postFilter = svelteStore.derived(
    [userIdsToExcludeWritable],
    ([$userIdsToExcludeWritable]) => {
      return (resourceObject: UserOrganizationWithRelationships) =>
        !$userIdsToExcludeWritable.includes(
          resourceObject.relationships.user.data.id,
        );
    },
  );
</script>

<SettingsPage internalRouteId="users">
  <svelte:fragment
    let:classNameToUse
    let:title
    slot="title-wrapper"
  >
    <div class={combineClasses(classNameToUse, "users__title-wrapper")}>
      <h1 class="users__title-heading">{title}</h1>
      <InviteModal>
        <Button
          slot="trigger"
          let:builder
          builders={[builder]}
          Icon={InviteIcon}
          size="medium">Invite</Button
        >
      </InviteModal>
    </div>
  </svelte:fragment>

  <ResourceListInfiniteScrollTable
    class="users__table-wrapper"
    columns={[
      {
        minWidth: "230px",
        name: "Personal details",
      },
      {
        minWidth: "140px",
        maxWidth: "0.33fr",
        name: "Role",
      },
      {
        minWidth: "130px",
        name: "Actions",
      },
    ]}
    {fetchResourceList}
    {onClickBodyRow}
    postFilter={$postFilter}
    tHeadClass="hide-accessibly--important users__thead"
  >
    <svelte:fragment
      let:column
      let:defaultValue
      let:rowData
      slot="body-cell"
    >
      {#if column.name === "Personal details"}
        <th class="users__personal-details">
          <p class="users__name">
            <Link to={makeUserPageLink(rowData)}>
              {prettifyUserName(castRowData(rowData).relationships.user.data)}
            </Link>
          </p>
          <p class="users__email"
            >{castRowData(rowData).relationships.user.data.attributes.email}</p
          >
        </th>
      {:else if column.name === "Role"}
        <td
          class={`users__role-cell users__role-cell--${castRowData(rowData).attributes.role}`}
        >
          {#if castRowData(rowData).attributes.role === "admin"}<AdminIcon
            />{:else}<UserIcon />{/if}
          {prettifyRole(castRowData(rowData).attributes.role)}</td
        >
      {:else if column.name === "Actions"}
        <td>
          <DeleteUserConfirmationModal
            onConfirm={onUserDeletionConfirmed}
            user={castRowData(rowData).relationships.user.data}
            userOrganization={castRowData(rowData)}
          >
            <Button
              slot="trigger"
              let:builder
              builders={[builder]}
              consequence="destruction"
              size="small">Remove</Button
            >
          </DeleteUserConfirmationModal>
        </td>
      {:else}
        <td>
          {defaultValue}
        </td>
      {/if}
    </svelte:fragment>
  </ResourceListInfiniteScrollTable>
</SettingsPage>

<style>
  :global(.page-with-sub-navigation__content) {
    margin-top: -0.35rem;
  }

  :global(.users__title-wrapper) {
    display: flex;
    flex-direction: row;
  }

  :global(.users__title-heading) {
    flex: 1;
  }

  :global(.users__table-wrapper) {
    margin-left: -0.5rem;
  }
  :global(.users__table-wrapper table) {
    margin-top: 20px;
    width: 100%;

    & th,
    & td {
      align-content: center;
    }
  }

  :global(.users__personal-details) {
    padding: 10px 0;
    font-weight: normal;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    overflow: hidden;
  }

  /* Allows header row to be hidden by `hide-accessibly` above */
  :global(.users__table-wrapper.table .users__thead) {
    display: block;
  }

  :global(.users__name a):hover {
    opacity: 1 !important;
  }

  :global(.users__email) {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  :global(.users__table-wrapper tr) {
    cursor: pointer;

    &:hover {
      & td,
      & th {
        background: rgba(255, 255, 255, 0.03);
      }

      & .users__name a {
        color: white;
      }
    }
  }

  :global(.users__role-cell) {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;

    & svg {
      color: rgba(255, 255, 255, 0.4);
    }
  }
</style>

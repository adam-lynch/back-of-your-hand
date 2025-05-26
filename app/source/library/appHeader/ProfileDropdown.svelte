<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2025 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import HamburgerIcon from "~icons/radix-icons/hamburger-menu";

  import { organization, user } from "../../userData/store";
  import Button from "../forms/Button.svelte";
  import OrganizationLogo from "../OrganizationLogo.svelte";
  import combineClasses from "../utilities/combineClasses";
  import { type NavigationItem } from "./navigation";
  import WithNavigationPopover from "./WithNavigationPopover.svelte";

  export let buttonClassName = "";
  export let className = "";

  const filterNavigationItems = (navigationItems: NavigationItem[]) => [
    ...(navigationItems.find(({ id }) => id === "profile")?.childItems ?? []),
    ...navigationItems.filter(({ requirementsToExist }) =>
      requirementsToExist?.includes("not-organization-plan"),
    ),
  ];
</script>

<WithNavigationPopover
  className={combineClasses(className, "profile-dropdown")}
  {filterNavigationItems}
  let:builders
>
  <Button
    {builders}
    class={combineClasses("profile-dropdown__button", buttonClassName)}
    variant="unstyled"
  >
    {#if $user && $organization}
      <OrganizationLogo
        class="profile-dropdown__organization-logo"
        imageAttributes={{ alt: "", src: $organization.attributes.logo }}
        organizationName={$organization.attributes.name}
      />
      <span class="profile-dropdown__button-text">
        <span class="profile-dropdown__button-primary-text">
          {$user.attributes.firstName}
          {$user.attributes.lastName}
        </span>
        <span class="profile-dropdown__button-secondary-text">
          {$organization.attributes.name}
        </span>
      </span>
    {:else}
      <span class="profile-dropdown__button-text">
        <span class="profile-dropdown__button-primary-text"> Menu </span>
      </span>
    {/if}
    <HamburgerIcon />
  </Button>
</WithNavigationPopover>

<style>
  :global(.profile-dropdown) {
    --profile-dropdown__line-height: 20px;

    display: flex;
    flex-direction: column;
  }

  :global(.profile-dropdown__button) {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    color: inherit;
    margin-right: calc(
      var(--app-header__padding-horizontal) -
        var(--app-header__minimum-horizontal-gap)
    );
  }

  :global(.profile-dropdown__organization-logo) {
    max-width: calc(var(--profile-dropdown__line-height) * 2);
  }

  :global(.profile-dropdown__button) {
    flex: 1;
  }

  .profile-dropdown__button-text {
    display: flex;
    flex-direction: column;
    align-items: start;
    line-height: var(--profile-dropdown__line-height);
  }

  .profile-dropdown__button-primary-text {
    font-size: 14px;
  }

  .profile-dropdown__button-text:has(.profile-dropdown__button-secondary-text)
    .profile-dropdown__button-primary-text {
    font-weight: 700;
  }

  .profile-dropdown__button-secondary-text {
    font-size: 12px;
    opacity: 0.8;
  }
</style>

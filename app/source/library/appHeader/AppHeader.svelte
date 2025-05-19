<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import LogoLink from "../LogoLink.svelte";
  import HamburgerNavigation from "./HamburgerNavigation.svelte";
  import InlineNavigation from "./InlineNavigation.svelte";
  import ProfileDropdown from "./ProfileDropdown.svelte";
</script>

<header class="app-header">
  <nav class="nav">
    <div class="main-content">
      <h2 class="logo-container">
        <LogoLink
          class="app-header__full-height-tap-target app-header__full-height-tap-target--first"
        />
      </h2>
      <InlineNavigation
        className="inline-navigation"
        itemClassName="app-header__full-height-tap-target"
      />
    </div>

    <ProfileDropdown
      buttonClassName="app-header__full-height-tap-target app-header__full-height-tap-target--last"
      className="profile-dropdown"
    />
    <HamburgerNavigation
      buttonClassName="app-header__full-height-tap-target app-header__full-height-tap-target--last"
      className="app-header__hamburger-navigation"
    />
  </nav>
</header>

<style>
  .app-header {
    --app-header__padding-horizontal: 15px;
    --app-header__padding-vertical: 10px;
    --app-header__minimum-horizontal-gap: 20px;

    background: #160018;
    color: #ececec;
    display: flex;

    position: absolute;
    inset: 0;
    bottom: auto;
    z-index: 2;

    height: var(--app-header-height);

    & + * {
      padding-top: var(--app-header-height);

      /* This prevents the scrollable area from starting under the header */
      &.page__main-scrollable {
        padding-top: 0;
        margin-top: var(--app-header-height);
      }
    }
  }

  :global(.app-header__full-height-tap-target) {
    padding-block: var(--app-header__padding-vertical);
    padding-inline: calc(var(--app-header__minimum-horizontal-gap) / 2);
  }

  :global(.app-header__full-height-tap-target--first) {
    padding-left: var(--app-header__padding-horizontal);
  }

  :global(.app-header__full-height-tap-target--last) {
    padding-right: var(--app-header__padding-horizontal);
  }

  .nav {
    display: flex;
    flex: 1;
  }

  .main-content {
    display: flex;
    flex: 1;
    gap: var(--app-header__minimum-horizontal-gap);
  }

  .logo-container {
    display: flex;

    & a {
      flex: 1;
    }
  }

  :global(.inline-navigation) {
    display: none;
    flex: 1;
  }

  :global(.profile-dropdown) {
    display: none;
    padding-left: var(--app-header__padding-horizontal);
    overflow: hidden;
  }

  /* This width needs to stay in sync with other code with a comment that mentions "HAMBURGER_MENU" */
  @media (min-width: 620px) {
    :global(.inline-navigation),
    :global(.profile-dropdown) {
      display: flex;
    }

    :global(.app-header__hamburger-navigation) {
      display: none;
    }
  }
</style>

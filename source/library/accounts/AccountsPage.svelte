<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { navigate } from "svelte-routing";

  import Logo from "../Logo.svelte";
  import Page from "../Page.svelte";
  import { type InternalRoute } from "../routing/getInternalRoutes";
  import { organization, user } from "../../userData/store";
  import { onMount } from "svelte";
  import OrganizationLogo from "../OrganizationLogo.svelte";
  import fetchAndStoreOrganization from "../../userData/fetchAndStoreOrganization";

  export let internalRoute: InternalRoute;
  export let shouldRedirectIfUserExists = true;

  onMount(() => {
    const unsubscribe = user.subscribe((value) => {
      if (shouldRedirectIfUserExists && value) {
        console.debug("Navigating to root because user exists...", { user });
        // TODO: continue param
        navigate("/", { replace: false });
      }
    });

    fetchAndStoreOrganization();

    return () => unsubscribe();
  });
</script>

<Page
  {internalRoute}
  shouldHaveAppHeader={false}
>
  <div class="accounts-page">
    <div class="accounts-page__inner">
      <main>
        <div>
          {#if $organization}
            <OrganizationLogo
              class="accounts-page__organization-logo"
              organizationName={$organization.attributes.name}
              imageAttributes={{
                alt: $organization.attributes.name,
                src: $organization.attributes.logo,
              }}
            />
          {/if}
        </div>
        <h1 class="accounts-page__title">{internalRoute.title}</h1>

        <slot />
      </main>

      <footer>
        <Logo class="accounts-page__logo" />
      </footer>
    </div>
  </div>
</Page>

<style>
  .accounts-page {
    height: 100%;
    display: flex;

    @media (min-width: 800px) {
      align-items: center;
      justify-content: center;
      justify-items: center;
    }
  }

  .accounts-page__inner {
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    padding: 80px 40px 40px;
    border-radius: 7px;

    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 800px) {
      width: 50%;
      max-width: 600px;
      justify-content: center;
    }
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 80vw;

    @media (min-width: 800px) {
      min-width: 0;
    }
  }

  :global(.accounts-page__organization-logo) {
    height: 100px;
    width: 100px;
    margin-bottom: 40px;
  }

  .accounts-page__title {
    margin-bottom: 20px;

    @media (min-height: 800px) {
      margin-bottom: 80px;
    }
  }

  :global(.accounts-page__logo) {
    margin-top: 40px;
    opacity: 0.1;
    max-width: 200px;

    @media (min-height: 800px) {
      margin-top: 120px;
    }
  }
</style>

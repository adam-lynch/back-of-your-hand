<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import Link from "../Link.svelte";
  import getInternalRoutes from "../routing/getInternalRoutes";
  import AccountsPage from "./AccountsPage.svelte";

  const internalRoutes = getInternalRoutes();
</script>

<AccountsPage internalRoute={internalRoutes.loggedOut}>
  <Link
    class="logged-out-page__cta"
    to={internalRoutes.logIn.path}>Log back in</Link
  >
</AccountsPage>

<style>
  :global(.logged-out-page__cta) {
    margin-top: 20px;
  }
</style>

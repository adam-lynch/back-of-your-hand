<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script>
  import { onMount } from "svelte";
  import getInternalRoutes from "../routing/getInternalRoutes";
  import AccountsPage from "./AccountsPage.svelte";
  import eventEmitter from "../../utilities/eventEmitter";

  const internalRoutes = getInternalRoutes();

  onMount(() => {
    eventEmitter.emit("lack-of-authentication-detected", {
      cause: "own-user-organization-account-deleted",
    });
  });
</script>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<AccountsPage
  internalRoute={internalRoutes.accountDeleted}
  shouldRedirectIfUserExists={false}
>
  <p>Sorry to see you go!</p>
</AccountsPage>

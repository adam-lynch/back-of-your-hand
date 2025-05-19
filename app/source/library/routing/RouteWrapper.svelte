<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->
<script lang="ts">
  import { Toaster } from "svelte-french-toast";
</script>

<div class="route-wrapper">
  <slot />

  <Toaster />
</div>

<style>
  .route-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;

    background: #0d030d;
    color: #ececec;
  }

  :global(body:has([role$="dialog"][data-state="open"]) .route-wrapper) {
    filter: blur(5px) saturate(0);
  }
</style>

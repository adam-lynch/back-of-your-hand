<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import EmailIcon from "~icons/mdi/alternate-email";
  import Button from "./forms/Button.svelte";
  import ContactModal from "./ContactModal.svelte";

  export let title = "Contact support";
  export let username: string | undefined = undefined;
</script>

<ContactModal
  {title}
  {username}
>
  <Button
    {...$$restProps}
    builders={[builder]}
    Icon={EmailIcon}
    let:builder
    size="small"
    slot="trigger"
  >
    {title}
  </Button>
</ContactModal>

<style>
</style>

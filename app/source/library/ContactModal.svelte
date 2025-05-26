<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { derived, writable } from "svelte/store";
  import Modal from "./Modal.svelte";

  export let title = "Contact support";
  export let username = "&#x73;&#x75;&#x70;&#x70;&#x6F;&#x72;&#x74;";

  const isOpen = writable(false);
  let email = derived([isOpen], ([$isOpen]) => {
    if (!$isOpen) {
      return "";
    }
    return (
      username +
      "&#x40;" +
      "&#x62;&#x61;&#x63;&#x6B;&#x6F;&#x66;&#x79;&#x6F;&#x75;&#x72;&#x68;&#x61;&#x6E;&#x64;" +
      "&#x2E;" +
      "&#x63;&#x6F;&#x6D;"
    );
  });
</script>

<Modal
  {isOpen}
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

  <svelte:fragment slot="content">
    <p>
      All feedback is welcome at
      <a
        class="link"
        href={`mailto:${$email}`}
        {...{
          /* eslint-disable-next-line svelte/no-at-html-tags */
        }}>{@html $email}</a
      >
    </p>
  </svelte:fragment>
</Modal>

<style>
  .link {
    color: #df206f;
    text-decoration: underline;
  }
</style>

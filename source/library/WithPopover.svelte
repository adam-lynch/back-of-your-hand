<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2025 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { Popover, type PopoverContentProps } from "bits-ui";

  import combineClasses from "./utilities/combineClasses";

  export let contentProps: PopoverContentProps = {};
</script>

<Popover.Root>
  <Popover.Trigger
    asChild
    let:builder
  >
    <slot
      builders={[builder]}
      name="trigger"
    />
  </Popover.Trigger>
  <Popover.Content
    {...contentProps}
    class={combineClasses("with-popover__content", contentProps.class)}
  >
    <slot name="content" />
  </Popover.Content>
</Popover.Root>

<style>
  :global(.with-popover__content) {
    z-index: 999999;
    width: 100%;
    max-width: 200px;
    border-radius: 5px;
    background: #160218;
    color: #fff;
    border: 1px solid rgba(51, 51, 51, 0.1);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { Dialog } from "bits-ui";

  import { fade } from "svelte/transition";
  import { flyAndScale } from "./utilities/transitions";
  import Button from "./forms/Button.svelte";
  import { writable } from "svelte/store";

  export let description: string = "";
  export let isOpen = writable(true);
  export let onOpenChange = () => {};
  export let title: string;

  const closeModal = () => {
    isOpen.set(false);
  };
</script>

<Dialog.Root
  {...$$restProps}
  {onOpenChange}
  bind:open={$isOpen}
>
  <Dialog.Trigger
    asChild
    let:builder
  >
    <slot
      name="trigger"
      {builder}
    />
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay
      transition={fade}
      transitionConfig={{ duration: 150 }}
      class="modal__overlay"
    />
    <Dialog.Content
      class="modal__dialog"
      transition={flyAndScale}
      transitionConfig={{ duration: 150 }}
    >
      <Dialog.Title class="modal__title">{title}</Dialog.Title>

      {#if description}
        <Dialog.Description class="modal__description">
          {description}
        </Dialog.Description>
      {/if}

      <slot
        {closeModal}
        name="content"
      />

      <slot
        {closeModal}
        name="buttons"
      >
        <div class="modal__buttons">
          <Dialog.Close
            asChild
            class="modal__cancel"
            let:builder
          >
            <Button
              builders={[builder]}
              theme="light"
              variant="primary">Close</Button
            >
          </Dialog.Close>
        </div>
      </slot>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.modal__overlay) {
    position: fixed;
    inset: 0;
    z-index: 50;
    background-color: rgba(0, 0, 0, 0.85);
  }

  :global(.modal__dialog) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;

    width: 100%;
    max-width: 94%;
    max-height: 90vh;
    overflow-y: auto;

    background-color: #0d030d;
    color: #ececec;
    border-radius: 1rem;
    border: 1px solid #180f18;
    padding: 1.75rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    outline: none;

    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  @media (min-width: 640px) {
    :global(.modal__dialog) {
      max-width: 640px; /* sm:max-w-lg */
    }
  }

  :global(.modal__title) {
    font-size: 28px;

    @media (min-height: 900px) {
      margin-bottom: 10px;
    }
  }

  :global(.modal__description) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    line-height: 1.5;
  }

  :global(.modal__buttons) {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
  }
</style>

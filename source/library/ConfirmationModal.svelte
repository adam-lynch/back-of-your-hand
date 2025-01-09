<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { AlertDialog } from "bits-ui";

  import Button from "./forms/Button.svelte";
  import { fade } from "svelte/transition";
  import { flyAndScale } from "./utilities/transitions";

  export let confirmText = "Confirm";
  export let description: string;
  export let onConfirm: (event: SubmitEvent) => void;
  export let title = "Are you sure?";

  let isOpen = false;

  const onSubmit = (event: SubmitEvent) => {
    onConfirm(event);
    if (event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    isOpen = false;
  };
</script>

<AlertDialog.Root bind:open={isOpen}>
  <AlertDialog.Trigger
    asChild
    let:builder
  >
    <slot
      name="trigger"
      {builder}
    />
  </AlertDialog.Trigger>

  <AlertDialog.Portal>
    <AlertDialog.Overlay
      transition={fade}
      transitionConfig={{ duration: 150 }}
      class="confirmation-modal__overlay"
    />
    <AlertDialog.Content
      class="confirmation-modal__dialog"
      transition={flyAndScale}
      transitionConfig={{ duration: 150 }}
    >
      <AlertDialog.Title class="confirmation-modal__title"
        >{title}</AlertDialog.Title
      >

      <AlertDialog.Description class="confirmation-modal__description">
        {description}
      </AlertDialog.Description>

      <form
        action="#"
        class="confirmation-modal__buttons"
        on:submit={onSubmit}
      >
        <AlertDialog.Cancel
          class="confirmation-modal__cancel"
          asChild
          let:builder
        >
          <Button
            builders={[builder]}
            theme="dark"
          >
            Cancel
          </Button>
        </AlertDialog.Cancel>

        <Button
          class="confirmation-modal__confirm"
          theme="dark"
          type="submit"
        >
          {confirmText}
        </Button>
      </form>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>

<style>
  :global(.confirmation-modal__overlay) {
    position: fixed;
    inset: 0;
    z-index: 50;
    background-color: rgba(0, 0, 0, 0.85);
  }

  :global(.confirmation-modal__dialog) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;

    width: 100%;
    max-width: 94%;

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
    :global(.confirmation-modal__dialog) {
      max-width: 640px; /* sm:max-w-lg */
    }
  }

  :global(.confirmation-modal__title) {
    font-size: 28px;

    @media (min-height: 900px) {
      margin-bottom: 10px;
    }
  }

  :global(.confirmation-modal__description) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    line-height: 1.5;
  }

  :global(.confirmation-modal__buttons) {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
  }
</style>

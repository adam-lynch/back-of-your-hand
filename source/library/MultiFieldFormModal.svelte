<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import Modal from "./Modal.svelte";
  import MultiFieldForm from "./forms/MultiFieldForm.svelte";
  import type { MaybePromise } from "../utilities/utilityTypes";
  import type yup from "./forms/yup";
  import type { createForm } from "felte";
  import { writable } from "svelte/store";

  export let description = "";
  export let onSubmit: (
    form: ReturnType<typeof createForm>,
  ) => MaybePromise<void>;
  export let schema: yup.ObjectSchema<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any;
  }>;
  export let title: string;

  const handleOnSubmit: typeof onSubmit = async (...args) => {
    await onSubmit(...args);
    isOpen.set(false);
  };
  const isOpen = writable(false);
</script>

<Modal
  {description}
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

  <svelte:fragment
    let:closeModal
    slot="content"
  >
    <MultiFieldForm
      action="#"
      let:form
      let:isSubmitting
      let:generalErrorMessages
      onSubmit={handleOnSubmit}
      {schema}
    >
      <div class="multi-field-form-modal__fields">
        <slot
          name="fields"
          {form}
          {generalErrorMessages}
        />
      </div>

      <footer class="multi-field-form-modal__footer">
        <slot
          {closeModal}
          {isSubmitting}
          name="footer"
        />
      </footer>
    </MultiFieldForm>
  </svelte:fragment>

  <svelte:fragment slot="buttons">
    <span class="multi-field-form-modal__hide">&nbsp;</span>
  </svelte:fragment>
</Modal>

<style>
  :global(.multi-field-form-modal__fields) {
    display: flex;
    flex-direction: column;
  }

  :global(.multi-field-form-modal__footer) {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;

    @media (min-height: 900px) {
      margin-top: 2rem;
    }
  }

  :global(.multi-field-form-modal__hide) {
    display: none;
  }
</style>

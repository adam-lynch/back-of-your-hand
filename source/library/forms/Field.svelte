<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { ValidationMessage } from "@felte/reporter-svelte";
  import type { createForm } from "felte";

  import combineClasses from "../utilities/combineClasses";
  import type { Theme } from "../themes";
  import ErrorMessages from "./ErrorMessages.svelte";

  export let form: ReturnType<typeof createForm>;
  export let labelText: string;
  export let name: string;
  export let theme: Theme = "dark";

  const classes = ["field", `field--theme-${theme}`, $$restProps.class];
  const errorMessagesId = `${name}__error-messages`;

  $: isInvalid = Boolean(form.errors?.[name]?.length);
</script>

<div
  {...$$restProps}
  class={combineClasses(...classes)}
>
  <label
    class="field__label"
    for={name}
  >
    <span class="field__label-inner">{labelText}</span>
    <span class="field__optional-indicator">(optional)</span>
  </label>

  <!-- felte handles stuff like the `aria-invalid` attribute -->
  <slot
    _class="field__control"
    _name={name}
    ariaDescribedby={isInvalid ? errorMessagesId : undefined}
    id={name}
    {theme}
  />

  <ValidationMessage
    for={name}
    let:messages
  >
    <ErrorMessages
      class="field-error-messages"
      id={errorMessagesId}
      isForOneField
      messages={messages || []}
    />
  </ValidationMessage>
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .field__label {
    font-weight: 600;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .field__label-inner {
    flex: 1;
  }

  .field__optional-indicator {
    margin-left: 0.5rem;
    font-weight: normal;
    font-size: 0.8rem;
    opacity: 0.8;
  }

  :global(.field:has(.field__control[required]) .field__optional-indicator) {
    display: none;
  }

  .field :global(.field-error-messages) {
    margin-top: -0.65em;
    margin-bottom: 0.4em;
  }
</style>

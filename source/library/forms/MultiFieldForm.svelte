<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { reporter } from "@felte/reporter-svelte";
  import { validator } from "@felte/validator-yup";
  import { createForm } from "felte";

  import combineClasses from "../utilities/combineClasses";
  import type { MaybePromise } from "../../utilities/utilityTypes";
  import type yup from "./yup";
  import onFormApiRequestError from "./onFormApiRequestError";
  import { writable } from "svelte/store";

  export let decideIfGeneralErrorsAreUnexpected:
    | ((errorMessages: string[]) => boolean)
    | undefined = undefined;
  export let onSubmit: (
    form: ReturnType<typeof createForm>,
  ) => MaybePromise<void>;
  export let schema: yup.ObjectSchema<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any;
  }>;

  const generalErrorMessages = writable<string[]>([]);

  type Schema = yup.InferType<typeof schema>;

  const form = createForm<Schema>({
    extend: [validator({ schema }), reporter],
    onSubmit: async () => {
      try {
        await onSubmit(form);
      } catch (e) {
        generalErrorMessages.set(
          onFormApiRequestError<Schema>(
            form,
            e,
            decideIfGeneralErrorsAreUnexpected,
          ),
        );
      }
    },
  });

  const isSubmitting = form.isSubmitting;

  form.data.subscribe(() => {
    generalErrorMessages.set([]);
  });

  const classes = ["form", $$restProps.class];
</script>

<form
  {...$$restProps}
  class={combineClasses(...classes)}
  use:form.form
>
  <slot
    {form}
    isSubmitting={$isSubmitting}
    generalErrorMessages={$generalErrorMessages}
  />
</form>

<style>
</style>

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
  import debounce from "lodash/debounce";
  import uniqueId from "lodash/uniqueId";
  import * as svelteStore from "svelte/store";
  import { onDestroy } from "svelte";

  import enableAutoSaving from "./enableAutoSaving";
  import Field from "../Field.svelte";
  import SelectInput from "../SelectInput.svelte";
  import patchResourceOnWritableUpdated from "./patchResourceOnWritableUpdated";
  import type { AnyResourceObject } from "../../../api/resourceObjects";
  import yup from "../yup";
  import type { Theme } from "../../themes";
  import onFormApiRequestError from "../onFormApiRequestError";

  export let fieldProps: Record<string, unknown> & {
    labelText: string;
  };
  export let schema: yup.StringSchema;
  export let selectProps: Record<string, unknown> & {
    options: {
      label: string;
      value: string;
    }[];
  };
  export let shouldPatchResourceOnWritableUpdated = false;
  export let theme: Theme = "dark";
  export let writable: svelteStore.Writable<unknown>;
  export let writableSelector: string | undefined;

  const pendingChanges = svelteStore.writable(null);
  const name = uniqueId("field__");
  let value: string | undefined;

  const formSchema = yup.object({
    [name]: schema.label(fieldProps.labelText),
  });

  type Schema = yup.InferType<typeof formSchema>;

  const form = createForm<Schema>({
    extend: [validator({ schema: formSchema }), reporter],
    onSubmit: async () => {
      const pendingChangesValue = svelteStore.get(pendingChanges);
      if (!pendingChangesValue) {
        throw new Error("!pendingChangesValue");
      }
      if (shouldPatchResourceOnWritableUpdated) {
        try {
          await patchResourceOnWritableUpdated(
            pendingChangesValue,
            svelteStore.get(writable) as AnyResourceObject,
          );
        } catch (error) {
          onFormApiRequestError<Schema>(form, error);
        }
      }
    },
  });

  const { onChange, unsubscribe } = enableAutoSaving<string>({
    fallbackValue: "",
    getValue() {
      return value;
    },
    onWritableUpdated: debounce((changes) => {
      pendingChanges.set(changes);
      form.handleSubmit();
    }, 250),
    setValue(newValue) {
      value = newValue;
    },
    writable,
    writableSelector,
  });

  onDestroy(unsubscribe);
</script>

<form
  {...$$restProps}
  use:form.form
>
  <Field
    {...fieldProps}
    {form}
    let:_class
    let:_name
    let:ariaDescribedby
    let:id
    {name}
    {theme}
  >
    <SelectInput
      {...selectProps}
      aria-describedby={ariaDescribedby}
      bind:value
      class={_class}
      {id}
      on:change={onChange}
      name={_name}
      {theme}
    />
  </Field>
</form>

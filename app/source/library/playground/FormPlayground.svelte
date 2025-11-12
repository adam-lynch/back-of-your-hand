<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import type { Attribute } from "./types";
  import Table from "./Table.svelte";
  import PlaygroundPage from "./PlaygroundPage.svelte";
  import TextInput from "../forms/TextInput.svelte";
  import Field from "../forms/Field.svelte";
  import MultiFieldForm from "../forms/MultiFieldForm.svelte";
  import yup from "../forms/yup";
  import commonSchema from "../forms/commonSchema";
  import SelectInput from "../forms/SelectInput.svelte";
  import CheckboxInput from "../forms/CheckboxInput.svelte";

  const attributes: Attribute[] = [];
</script>

<PlaygroundPage
  title="Form"
  let:pageTheme
>
  <Table {attributes}>
    <svelte:fragment
      slot="render-component"
      let:props
    >
      <MultiFieldForm
        {...props}
        let:form
        onSubmit={() => {}}
        schema={yup.object({
          checkbox: commonSchema.checkbox(true).label("Checkbox"),
          email: commonSchema.email().label("Email"),
          firstName: yup.string().label("First name").max(3).required(),
          lastName: yup.string().label("Last name").required(),
          password1: commonSchema.newPassword().label("Password"),
          password2: yup
            .string()
            .oneOf([yup.ref("password1"), ""], "Passwords must match")
            .required("Please confirm your password")
            .label("Confirm Password"),
          select: yup.string().required(),
        })}
      >
        <Field
          {form}
          labelText="Email"
          name="email"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          let:theme
          theme={pageTheme}
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            autofocus
            class={_class}
            name={_name}
            {id}
            required
            {theme}
            type="email"
          />
        </Field>

        <Field
          {form}
          labelText="First name"
          name="firstName"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          let:theme
          theme={pageTheme}
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            class={_class}
            maxlength="3"
            name={_name}
            {id}
            required
            {theme}
          />
        </Field>

        <Field
          {form}
          labelText="Last name"
          name="lastName"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          let:theme
          theme={pageTheme}
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            class={_class}
            name={_name}
            {id}
            required
            {theme}
          />
        </Field>

        <Field
          {form}
          labelText="Password"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          let:theme
          name="password1"
          theme={pageTheme}
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            autocomplete="new-password"
            class={_class}
            {id}
            name={_name}
            required
            {theme}
            type="password"
          />
        </Field>

        <Field
          {form}
          labelText="Confirm password"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          let:theme
          name="password2"
          required
          theme={pageTheme}
        >
          <TextInput
            aria-describedby={ariaDescribedby}
            autocomplete="new-password"
            class={_class}
            {id}
            name={_name}
            required
            {theme}
            type="password"
          />
        </Field>

        <Field
          {form}
          labelText="Select an option"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          let:theme
          name="select"
          required
          theme={pageTheme}
        >
          <SelectInput
            aria-describedby={ariaDescribedby}
            class={_class}
            {id}
            name={_name}
            options={[
              { label: "Hello", value: "hello" },
              { label: "World", value: "world" },
            ]}
            required
            {theme}
          />
        </Field>

        <Field
          {form}
          labelText="Checkbox"
          let:_class
          let:_name
          let:ariaDescribedby
          let:id
          let:theme
          name="checkbox"
          required
          theme={pageTheme}
        >
          <CheckboxInput
            aria-describedby={ariaDescribedby}
            class={_class}
            {id}
            name={_name}
            required
            {theme}
          />
        </Field>
      </MultiFieldForm>
    </svelte:fragment>
  </Table>
</PlaygroundPage>

<style>
</style>

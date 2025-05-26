<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import type { MaybePromise } from "../../utilities/utilityTypes";
  import MultiFieldForm from "../forms/MultiFieldForm.svelte";
  import type yup from "../forms/yup";
  import { type InternalRoute } from "../routing/getInternalRoutes";
  import AccountsPage from "./AccountsPage.svelte";
  import ErrorMessages from "../forms/ErrorMessages.svelte";

  export let decideIfErrorShouldBeReported:
    | ((error: unknown) => boolean)
    | undefined = undefined;
  export let decideIfGeneralErrorsAreUnexpected:
    | ((errorMessages: string[]) => boolean)
    | undefined = undefined;
  export let internalRoute: InternalRoute;
  export let onSubmit: () => MaybePromise<void>;
  export let schema: yup.ObjectSchema<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any;
  }>;
  export let shouldRedirectIfUserExists = true;
  export let topLevelErrorMessage = "";
</script>

<AccountsPage
  {internalRoute}
  {shouldRedirectIfUserExists}
>
  <slot name="top" />

  {#if topLevelErrorMessage}
    <p>Error: {topLevelErrorMessage}</p>
  {/if}

  <MultiFieldForm
    action="#"
    class="accounts-form-page__form"
    {decideIfErrorShouldBeReported}
    {decideIfGeneralErrorsAreUnexpected}
    let:form
    let:generalErrorMessages
    {onSubmit}
    {schema}
  >
    <slot
      name="fields"
      {form}
    />

    <ErrorMessages messages={generalErrorMessages} />

    <footer class="accounts-form-page__footer">
      <slot name="accounts-form-footer" />
    </footer>
  </MultiFieldForm>
</AccountsPage>

<style>
  :global(.accounts-form-page__form) {
    max-width: 350px;
    width: 100%;
  }

  :global(.accounts-form-page__footer) {
    margin-top: 20px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:has(> :only-child) {
      justify-self: center;
    }
  }
</style>

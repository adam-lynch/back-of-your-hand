/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { ClientRequestError } from "../../api/requestApi";
import { reportError } from "../../utilities/setUpErrorReporting";
import type yup from "./yup";
import type { createForm } from "felte";
import * as sveleteStore from "svelte/store";

type Schema = yup.InferType<
  yup.ObjectSchema<Record<string, string | undefined>>
>;

function addErrorToFormField<TSchema extends Schema = Schema>(
  form: ReturnType<typeof createForm<TSchema>>,
  fieldName: string,
  message: string,
) {
  const errorMessageSet = new Set<string>(
    sveleteStore.get(form.errors)[fieldName],
  );
  errorMessageSet.add(message);
  // @ts-expect-error seems like something is wrong with their types here maybe
  form.setErrors(fieldName, Array.from(errorMessageSet));
}

export default function onFormApiRequestError<TSchema extends Schema>(
  form: ReturnType<typeof createForm<TSchema>>,
  error: unknown,
  decideIfGeneralErrorsAreUnexpected: (
    errorMessages: string[],
  ) => boolean = () => true,
): string[] {
  reportError(error);

  const errorMessages: string[] = [];
  const fieldNames = Object.keys(sveleteStore.get(form.data));

  if (
    error instanceof ClientRequestError &&
    error.responseBody?.errors.length
  ) {
    for (const responseError of error.responseBody.errors) {
      if (responseError.detail) {
        let fieldNameFromError: string | undefined;
        const responseErrorSourceAsString =
          responseError.source &&
          (responseError.source.parameter || responseError.source.pointer);
        if (responseErrorSourceAsString) {
          fieldNameFromError = responseErrorSourceAsString.split("/").pop();
        }

        if (fieldNameFromError && fieldNames.includes(fieldNameFromError)) {
          addErrorToFormField<TSchema>(
            form,
            fieldNameFromError,
            responseError.detail,
          );
          continue;
        }

        errorMessages.push(responseError.detail);
      }
    }
  }

  if (!errorMessages.length) {
    return [];
  }

  const allMessages = [];
  if (decideIfGeneralErrorsAreUnexpected(errorMessages)) {
    allMessages.push(
      "Request failed. Unexpected server error" +
        (errorMessages.length > 1 ? "s" : ""),
    );
  }

  allMessages.push(...errorMessages);

  if (fieldNames.length === 1) {
    const fieldName = fieldNames[0];
    for (const errorMessage of allMessages) {
      addErrorToFormField<TSchema>(form, fieldName, errorMessage);
    }
    return [];
  }

  return allMessages;
}

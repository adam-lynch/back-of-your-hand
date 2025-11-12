/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import yup from "./yup";

function checkbox(
  mustBeChecked = false,
  errorText = "You must check this checkbox",
) {
  let result = yup.boolean();
  if (mustBeChecked) {
    result = result.oneOf([true], errorText).required();
  }
  return result;
}

function email() {
  return yup.string().email().required();
}

function newPassword() {
  return yup
    .string()
    .required()
    .test(
      "not-entirely-numeric",
      "Password must not be entirely numeric",
      (value) => {
        return value ? !/^\d+$/.test(value) : true;
      },
    )
    .min(8, "Password must be at least 8 characters");
}

export default {
  checkbox,
  email,
  newPassword,
};

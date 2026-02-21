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

function latitude() {
  return yup
    .string()
    .label("Latitude")
    .required()
    .test(
      "is-number",
      "Latitude must be a number",
      (value) => !value || !isNaN(Number(value)),
    )
    .test("in-range", "Latitude must be between -90 and 90", (value) => {
      if (!value || isNaN(Number(value))) return true;
      const num = Number(value);
      return num >= -90 && num <= 90;
    });
}

function longitude() {
  return yup
    .string()
    .label("Longitude")
    .required()
    .test(
      "is-number",
      "Longitude must be a number",
      (value) => !value || !isNaN(Number(value)),
    )
    .test("in-range", "Longitude must be between -180 and 180", (value) => {
      if (!value || isNaN(Number(value))) return true;
      const num = Number(value);
      return num >= -180 && num <= 180;
    });
}

export default {
  checkbox,
  email,
  latitude,
  longitude,
  newPassword,
};

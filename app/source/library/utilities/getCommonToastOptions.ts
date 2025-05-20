/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import toast from "svelte-french-toast";

export default function getCommonToastOptions(): Parameters<
  typeof toast.success
>[1] {
  return {
    position: "top-center",
    style:
      "background: hsl(210deg 9% 31% / 60%); color: #fff; text-shadow: 0 1px 0 hsl(210 11% 15%);",
  };
}

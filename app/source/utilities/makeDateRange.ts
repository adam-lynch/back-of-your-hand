/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as dateFns from "date-fns";

function makeDateRange(
  option:
    | "any"
    | "today"
    | "yesterday"
    | "this-week"
    | "last-week"
    | "this-month"
    | "last-month"
    | string,
): { start: string; end?: string } | null {
  const now = new Date();

  switch (option.toLowerCase()) {
    case "today": {
      const start = dateFns.startOfDay(now).toISOString();
      const end = dateFns.endOfDay(now).toISOString();
      return { start, end };
    }

    case "yesterday": {
      const yesterday = dateFns.subDays(now, 1);
      const start = dateFns.startOfDay(yesterday).toISOString();
      const end = dateFns.endOfDay(yesterday).toISOString();
      return { start, end };
    }

    case "this-week": {
      const start = dateFns.startOfWeek(now, { weekStartsOn: 1 }).toISOString(); // Assuming the week starts on Monday
      const end = dateFns.endOfWeek(now, { weekStartsOn: 1 }).toISOString();
      return { start, end };
    }

    case "last-week": {
      const lastWeek = dateFns.subWeeks(now, 1);
      const start = dateFns
        .startOfWeek(lastWeek, { weekStartsOn: 1 })
        .toISOString();
      const end = dateFns
        .endOfWeek(lastWeek, { weekStartsOn: 1 })
        .toISOString();
      return { start, end };
    }

    case "this-month": {
      const start = dateFns.startOfMonth(now).toISOString();
      const end = dateFns.endOfMonth(now).toISOString();
      return { start, end };
    }

    case "last-month": {
      const lastMonth = dateFns.subMonths(now, 1);
      const start = dateFns.startOfMonth(lastMonth).toISOString();
      const end = dateFns.endOfMonth(lastMonth).toISOString();
      return { start, end };
    }

    default:
      return null;
  }
}

export default makeDateRange;

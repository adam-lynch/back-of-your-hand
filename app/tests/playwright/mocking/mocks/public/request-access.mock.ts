/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

const mocks = {
  "can request organization access": {
    "POST backend.local-backofyourhand--backend.com:7200/open/request_organization_access":
      {
        "0": {
          method: "POST",
          url: "https://backend.local-backofyourhand--backend.com:7200/open/request_organization_access",
          status: 200,
          headers: {
            server: "Werkzeug/3.0.3 Python/3.11.15",
            date: "Mon, 23 Mar 2026 00:27:05 GMT",
            "content-type": "application/json",
            "x-frame-options": "DENY",
            "content-length": "16",
            vary: "Cookie, origin",
            "x-content-type-options": "nosniff",
            "referrer-policy": "same-origin",
            "cross-origin-opener-policy": "same-origin",
            "access-control-allow-origin":
              "https://local-backofyourhand.com:7210",
            "access-control-allow-credentials": "true",
            "djdt-store-id": "5433bc7bebcb4b6fb4c63935b4303605",
            "server-timing":
              'TimerPanel_utime;dur=37.11899999996149;desc="User CPU time", TimerPanel_stime;dur=11.617000000001099;desc="System CPU time", TimerPanel_total;dur=48.73599999996259;desc="Total CPU time", TimerPanel_total_time;dur=169.16608597966842;desc="Elapsed time", SQLPanel_sql_time;dur=23.13158501056023;desc="SQL 1 queries", CachePanel_total_time;dur=0;desc="Cache 0 Calls"',
            connection: "close",
          },
          body: {
            status: "OK",
          },
        },
      },
  },
};

export default mocks;

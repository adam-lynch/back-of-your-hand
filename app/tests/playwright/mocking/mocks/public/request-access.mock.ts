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
            date: "Tue, 17 Mar 2026 23:36:01 GMT",
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
            "djdt-store-id": "79d457d741544c8b98f8daff62ce7ff6",
            "server-timing":
              'TimerPanel_utime;dur=163.63400000000007;desc="User CPU time", TimerPanel_stime;dur=57.43999999999971;desc="System CPU time", TimerPanel_total;dur=221.07399999999978;desc="Total CPU time", TimerPanel_total_time;dur=1765.7338429999072;desc="Elapsed time", SQLPanel_sql_time;dur=23.641312996915076;desc="SQL 1 queries", CachePanel_total_time;dur=0;desc="Cache 0 Calls"',
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

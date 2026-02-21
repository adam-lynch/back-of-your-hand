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
    "POST backend.local-backofyourhand--backend.com:8000/open/request_organization_access":
      {
        "0": {
          method: "POST",
          url: "https://backend.local-backofyourhand--backend.com:8000/open/request_organization_access",
          status: 200,
          headers: {
            server: "Werkzeug/3.0.3 Python/3.11.14",
            date: "Wed, 11 Feb 2026 21:44:31 GMT",
            "content-type": "application/json",
            "x-frame-options": "DENY",
            "content-length": "16",
            vary: "Cookie, origin",
            "x-content-type-options": "nosniff",
            "referrer-policy": "same-origin",
            "cross-origin-opener-policy": "same-origin",
            "access-control-allow-origin":
              "https://local-backofyourhand.com:5173",
            "access-control-allow-credentials": "true",
            "djdt-store-id": "9543cebf276940bdb80f19da38900666",
            "server-timing":
              'TimerPanel_utime;dur=186.52699999999987;desc="User CPU time", TimerPanel_stime;dur=55.31599999999992;desc="System CPU time", TimerPanel_total;dur=241.8429999999998;desc="Total CPU time", TimerPanel_total_time;dur=1656.6004590131342;desc="Elapsed time", SQLPanel_sql_time;dur=38.19733299314976;desc="SQL 1 queries", CachePanel_total_time;dur=0;desc="Cache 0 Calls"',
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

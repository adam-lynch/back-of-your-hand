/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

const mocks = {
  "can navigate to diagnostics page": {
    "POST www.overpass-api.de/api/interpreter": {
      "0": {
        method: "POST",
        url: "https://www.overpass-api.de/api/interpreter",
        status: 200,
        headers: {
          date: "Wed, 11 Feb 2026 00:35:59 GMT",
          server: "Apache/2.4.66 (Debian)",
          "access-control-allow-origin": "*",
          "access-control-max-age": "600",
          vary: "Accept-Encoding",
          "content-encoding": "gzip",
          "content-length": "234",
          "keep-alive": "timeout=5, max=100",
          connection: "Keep-Alive",
          "content-type": "application/json",
        },
        body: {
          version: 0.6,
          generator: "Overpass API 0.7.62.10 2d4cfc48",
          osm3s: {
            timestamp_osm_base: "2026-02-11T00:34:38Z",
            copyright:
              "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
          },
          elements: [],
        },
      },
    },
    "POST z.overpass-api.de/api/interpreter": {
      "0": {
        method: "POST",
        url: "https://z.overpass-api.de/api/interpreter",
        status: 200,
        headers: {
          date: "Wed, 11 Feb 2026 00:36:00 GMT",
          server: "Apache/2.4.66 (Debian)",
          "access-control-allow-origin": "*",
          "access-control-max-age": "600",
          vary: "Accept-Encoding",
          "content-encoding": "gzip",
          "content-length": "234",
          "keep-alive": "timeout=5, max=100",
          connection: "Keep-Alive",
          "content-type": "application/json",
        },
        body: {
          version: 0.6,
          generator: "Overpass API 0.7.62.10 2d4cfc48",
          osm3s: {
            timestamp_osm_base: "2026-02-11T00:34:38Z",
            copyright:
              "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
          },
          elements: [],
        },
      },
    },
    "POST lz4.overpass-api.de/api/interpreter": {
      "0": {
        method: "POST",
        url: "https://lz4.overpass-api.de/api/interpreter",
        status: 504,
        headers: {
          date: "Wed, 11 Feb 2026 00:36:01 GMT",
          server: "Apache/2.4.66 (Debian)",
          "access-control-allow-origin": "*",
          "access-control-max-age": "600",
          vary: "Accept-Encoding",
          "content-encoding": "gzip",
          "content-length": "474",
          "keep-alive": "timeout=5, max=100",
          connection: "Keep-Alive",
          "content-type": "text/html; charset=utf-8",
        },
        body: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"\n    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n<head>\n  <meta http-equiv="content-type" content="text/html; charset=utf-8" lang="en"/>\n  <title>OSM3S Response</title>\n</head>\n<body>\n\n<p>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</p>\n<p><strong style="color:#FF0000">Error</strong>: runtime error: open64: 0 Success /osm3s_osm_base Dispatcher_Client::request_read_and_idx::timeout. The server is probably too busy to handle your request. </p>\n\n</body>\n</html>\n',
      },
    },
  },
  "can navigate to game page": {},
  "root path shows game": {},
};

export default mocks;

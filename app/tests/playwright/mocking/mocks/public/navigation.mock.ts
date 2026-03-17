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
          date: "Tue, 17 Mar 2026 23:35:26 GMT",
          server: "Apache/2.4.66 (Debian)",
          "access-control-allow-origin": "*",
          "access-control-max-age": "600",
          vary: "Accept-Encoding",
          "content-encoding": "gzip",
          "content-length": "855",
          "keep-alive": "timeout=5, max=100",
          connection: "Keep-Alive",
          "content-type": "application/json",
        },
        body: {
          version: 0.6,
          generator: "Overpass API 0.7.62.11 87bfad18",
          osm3s: {
            timestamp_osm_base: "2026-03-17T23:33:43Z",
            copyright:
              "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
          },
          elements: [
            {
              type: "node",
              id: 3815077900,
              lat: 0,
              lon: 0,
              tags: {
                description:
                  'Located at 0°N 0°E. The buoy ("Station 13010 – Soul") was part of the PIRATA system, a set of 17 buoys installed in the tropical Atlantic Ocean since 1997 by the United States, France, and Brazil.',
                "disused:man_made": "monitoring_station",
                "disused:monitoring:water_temperature": "yes",
                "disused:monitoring:weather": "yes",
                "disused:operator":
                  "Prediction and Research Moored Array in the Atlantic",
                "disused:seamark:buoy_special_purpose:category": "odas",
                "disused:seamark:buoy_special_purpose:colour": "red;white",
                "disused:seamark:buoy_special_purpose:colour_pattern":
                  "vertical",
                "disused:seamark:buoy_special_purpose:shape": "pillar",
                "disused:seamark:name": "Atlas Buoy",
                "disused:seamark:type": "buoy_special_purpose",
                height: "4",
                image: "File:Null_Island_2017.jpg",
                int_name: "Null Island",
                man_made: "monitoring_station",
                model: "ATLAS",
                "monitoring:meteorology": "yes",
                "monitoring:water_temperature": "yes",
                name: "Soul Buoy",
                "ref:wmo": "13010",
                url: "https://ndbc.noaa.gov/station_page.php?station=13010",
                website:
                  "https://pmel.noaa.gov/tao/drupal/pirata-display/0n0e.html",
                wikidata: "Q24041662",
                wikimedia_commons: "Category:Weather buoy station 13010",
                wikipedia: "en:Soul buoy",
                "wikipedia:en": "https://en.wikipedia.org/wiki/Null_Island",
                "wikipedia:es": "https://es.wikipedia.org/wiki/Null_Island",
              },
            },
          ],
        },
      },
    },
    "POST z.overpass-api.de/api/interpreter": {
      "0": {
        method: "POST",
        url: "https://z.overpass-api.de/api/interpreter",
        status: 429,
        headers: {
          date: "Tue, 17 Mar 2026 23:35:29 GMT",
          server: "Apache/2.4.66 (Debian)",
          "access-control-allow-origin": "*",
          "access-control-max-age": "600",
          vary: "Accept-Encoding",
          "content-encoding": "gzip",
          "content-length": "481",
          "keep-alive": "timeout=5, max=100",
          connection: "Keep-Alive",
          "content-type": "text/html; charset=utf-8",
        },
        body: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"\n    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n<head>\n  <meta http-equiv="content-type" content="text/html; charset=utf-8" lang="en"/>\n  <title>OSM3S Response</title>\n</head>\n<body>\n\n<p>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</p>\n<p><strong style="color:#FF0000">Error</strong>: runtime error: open64: 0 Success /osm3s_osm_base Dispatcher_Client::request_read_and_idx::rate_limited. Please check /api/status for the quota of your IP address. </p>\n\n</body>\n</html>\n',
      },
    },
    "POST lz4.overpass-api.de/api/interpreter": {
      "0": {
        method: "POST",
        url: "https://lz4.overpass-api.de/api/interpreter",
        status: 504,
        headers: {
          date: "Tue, 17 Mar 2026 23:35:34 GMT",
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
};

export default mocks;

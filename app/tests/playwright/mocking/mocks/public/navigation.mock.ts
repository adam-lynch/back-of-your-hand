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
          date: "Mon, 23 Mar 2026 00:26:27 GMT",
          server: "Apache/2.4.66 (Debian)",
          "access-control-allow-origin": "*",
          "access-control-max-age": "600",
          vary: "Accept-Encoding",
          "content-encoding": "gzip",
          "content-length": "853",
          "keep-alive": "timeout=5, max=100",
          connection: "Keep-Alive",
          "content-type": "application/json",
        },
        body: {
          version: 0.6,
          generator: "Overpass API 0.7.62.11 87bfad18",
          osm3s: {
            timestamp_osm_base: "2026-03-23T00:25:27Z",
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
                end_date: "2021-03",
                height: "4",
                image: "File:Null_Island_2017.jpg",
                int_name: "Null Island",
                model: "ATLAS",
                "monitoring:meteorology": "yes",
                "monitoring:water_temperature": "yes",
                name: "Soul Buoy",
                "ref:wmo": "13010",
                start_date: "1998-02",
                url: "https://ndbc.noaa.gov/station_page.php?station=13010",
                website:
                  "https://pmel.noaa.gov/tao/drupal/pirata-display/0n0e.html",
                wikidata: "Q24041662",
                wikimedia_commons: "Category:Weather buoy station 13010",
                wikipedia: "en:Null Island",
                "wikipedia:es": "Null Island",
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
        status: 200,
        headers: {
          date: "Mon, 23 Mar 2026 00:26:31 GMT",
          server: "Apache/2.4.66 (Debian)",
          "access-control-allow-origin": "*",
          "access-control-max-age": "600",
          vary: "Accept-Encoding",
          "content-encoding": "gzip",
          "content-length": "853",
          "keep-alive": "timeout=5, max=100",
          connection: "Keep-Alive",
          "content-type": "application/json",
        },
        body: {
          version: 0.6,
          generator: "Overpass API 0.7.62.11 87bfad18",
          osm3s: {
            timestamp_osm_base: "2026-03-23T00:25:27Z",
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
                end_date: "2021-03",
                height: "4",
                image: "File:Null_Island_2017.jpg",
                int_name: "Null Island",
                model: "ATLAS",
                "monitoring:meteorology": "yes",
                "monitoring:water_temperature": "yes",
                name: "Soul Buoy",
                "ref:wmo": "13010",
                start_date: "1998-02",
                url: "https://ndbc.noaa.gov/station_page.php?station=13010",
                website:
                  "https://pmel.noaa.gov/tao/drupal/pirata-display/0n0e.html",
                wikidata: "Q24041662",
                wikimedia_commons: "Category:Weather buoy station 13010",
                wikipedia: "en:Null Island",
                "wikipedia:es": "Null Island",
              },
            },
          ],
        },
      },
    },
    "POST lz4.overpass-api.de/api/interpreter": {
      "0": {
        method: "POST",
        url: "https://lz4.overpass-api.de/api/interpreter",
        status: 200,
        headers: {
          date: "Mon, 23 Mar 2026 00:26:37 GMT",
          server: "Apache/2.4.66 (Debian)",
          "access-control-allow-origin": "*",
          "access-control-max-age": "600",
          vary: "Accept-Encoding",
          "content-encoding": "gzip",
          "content-length": "853",
          "keep-alive": "timeout=5, max=100",
          connection: "Keep-Alive",
          "content-type": "application/json",
        },
        body: {
          version: 0.6,
          generator: "Overpass API 0.7.62.11 87bfad18",
          osm3s: {
            timestamp_osm_base: "2026-03-23T00:25:27Z",
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
                end_date: "2021-03",
                height: "4",
                image: "File:Null_Island_2017.jpg",
                int_name: "Null Island",
                model: "ATLAS",
                "monitoring:meteorology": "yes",
                "monitoring:water_temperature": "yes",
                name: "Soul Buoy",
                "ref:wmo": "13010",
                start_date: "1998-02",
                url: "https://ndbc.noaa.gov/station_page.php?station=13010",
                website:
                  "https://pmel.noaa.gov/tao/drupal/pirata-display/0n0e.html",
                wikidata: "Q24041662",
                wikimedia_commons: "Category:Weather buoy station 13010",
                wikipedia: "en:Null Island",
                "wikipedia:es": "Null Island",
              },
            },
          ],
        },
      },
    },
    "POST overpass.private.coffee/api/interpreter": {
      "0": {
        method: "POST",
        url: "https://overpass.private.coffee/api/interpreter",
        status: 200,
        headers: {
          server: "nginx/1.18.0",
          date: "Mon, 23 Mar 2026 00:26:49 GMT",
          "content-type": "application/json",
          "transfer-encoding": "chunked",
          connection: "keep-alive",
          "access-control-allow-origin": "*",
          "access-control-max-age": "600",
          "kumi-overpass-worker": "h9",
        },
        body: {
          version: 0.6,
          generator: "Overpass API 0.7.61.8 b1080abd",
          osm3s: {
            timestamp_osm_base: "2026-02-15T14:44:30Z",
            copyright:
              "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
          },
          elements: [],
        },
      },
    },
  },
};

export default mocks;

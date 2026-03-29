/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

const mocks = {"can play a complete round without authentication":{"POST www.overpass-api.de/api/interpreter":{"0":{"body":"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n    \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n<head>\n  <meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" lang=\"en\"/>\n  <title>OSM3S Response</title>\n</head>\n<body>\n\n<p>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</p>\n<p><strong style=\"color:#FF0000\">Error</strong>: runtime error: open64: 0 Success /osm3s_osm_base Dispatcher_Client::request_read_and_idx::timeout. The server is probably too busy to handle your request. </p>\n\n</body>\n</html>\n","status":504,"headers":{"content-type":"text/html; charset=utf-8"}}},"POST z.overpass-api.de/api/interpreter":{"0":{"body":"__shared_body::493f51ea336fd26c399e3ece48d355ad08a5bb4522d75bf2cf4093863cd1fa6c"}},"POST lz4.overpass-api.de/api/interpreter":{"0":{"body":"__shared_body::3a97a0c6c959ba188a6352c9115239dd2a6e5dfc21510f2968b5b044800b7e17"}}}};

export default mocks;

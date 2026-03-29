/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

const mocks = {"can navigate to diagnostics page":{"POST www.overpass-api.de/api/interpreter":{"0":{"body":"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n    \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n<head>\n  <meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" lang=\"en\"/>\n  <title>OSM3S Response</title>\n</head>\n<body>\n\n<p>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</p>\n<p><strong style=\"color:#FF0000\">Error</strong>: runtime error: open64: 0 Success /osm3s_osm_base Dispatcher_Client::request_read_and_idx::timeout. The server is probably too busy to handle your request. </p>\n\n</body>\n</html>\n","status":504,"headers":{"content-type":"text/html; charset=utf-8"}}},"POST z.overpass-api.de/api/interpreter":{"0":{"body":"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n    \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n<head>\n  <meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" lang=\"en\"/>\n  <title>OSM3S Response</title>\n</head>\n<body>\n\n<p>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</p>\n<p><strong style=\"color:#FF0000\">Error</strong>: runtime error: open64: 0 Success /osm3s_osm_base Dispatcher_Client::request_read_and_idx::timeout. The server is probably too busy to handle your request. </p>\n\n</body>\n</html>\n","status":504,"headers":{"content-type":"text/html; charset=utf-8"}}},"POST lz4.overpass-api.de/api/interpreter":{"0":{"body":"__shared_body::a999dd2b0953b12e838f16fb23a125fca7e46039467e76b349125f2be91c2864"}}}};

export default mocks;

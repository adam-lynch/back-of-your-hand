/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

/**
 * Test user credentials that match backend seeding.
 * See backend README for full list of available users.
 */

export const example1Users = {
  admin: {
    email: "paigecollins@example.com",
    password: "admin",
    firstName: "Paige",
    lastName: "Collins",
  },
  standardUser: {
    email: "testuser1@example.com",
    password: "testuser1",
    firstName: "Michael",
    lastName: "Rodriguez",
  },
};

export const example2Users = {
  admin: {
    email: "kevin.davis@example2.com",
    password: "pass37",
    firstName: "Kevin",
    lastName: "Davis",
  },
  standardUser: {
    email: "rachel.brown@example2.com",
    password: "pass36",
    firstName: "Rachel",
    lastName: "Brown",
  },
};

export const organizations = {
  example1: {
    subdomain: "example1",
    name: "Example 1",
    baseUrl: "https://example1.local-backofyourhand.com:5173",
  },
  example2: {
    subdomain: "example2",
    name: "Example 2",
    baseUrl: "https://example2.local-backofyourhand.com:5173",
  },
};

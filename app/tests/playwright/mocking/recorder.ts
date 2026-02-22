/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import type { Page, Route, TestInfo } from "@playwright/test";
import { generatePlaywrightMocks } from "./generate-mocks";
import isRecordableRequest from "./is-recordable-request";
import type { RecordedResponse } from "./types";

export class ApiRecorder {
  private responses: RecordedResponse[] = [];
  private counters: Map<string, number> = new Map();
  private errors: string[] = [];
  private inflight: Promise<void>[] = [];
  private testPath: string[];
  private pages: Page[] = [];

  constructor(private testInfo: TestInfo) {
    this.testPath = testInfo.titlePath.slice(1);
  }

  async addPage(page: Page, subdomain?: string): Promise<void> {
    this.pages.push(page);
    await page.route("**/*", (route) => {
      const url = route.request().url();

      if (!isRecordableRequest(url)) {
        void route.continue();
        return;
      }

      this.inflight.push(this.recordRequest(route, url, subdomain));
    });
  }

  async waitForInflight(): Promise<void> {
    await Promise.allSettled(this.inflight);
  }

  private async recordRequest(
    route: Route,
    url: string,
    subdomain?: string,
  ): Promise<void> {
    try {
      const response = await route.fetch();
      const contentType = response.headers()["content-type"] || "";

      let body: unknown = null;
      let bodyText = "";

      try {
        bodyText = await response.text();
        if (contentType.includes("application/json") && bodyText) {
          body = JSON.parse(bodyText);
        } else {
          body = bodyText;
        }
      } catch (error) {
        console.warn(`Failed to parse response body for ${url}:`, error);
        this.errors.push(url);
        await route.continue();
        return;
      }

      const urlObj = new URL(url);
      const urlWithoutProtocol = `${urlObj.host}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
      const method = route.request().method();
      const endpoint = `${method} ${urlWithoutProtocol}`;

      const currentCount = this.counters.get(endpoint) || 0;
      this.counters.set(endpoint, currentCount + 1);

      this.responses.push({
        body,
        method,
        status: response.status(),
        subdomain,
        url,
        headers: response.headers(),
        endpoint,
        index: currentCount,
        testPath: this.testPath,
      });

      await route.fulfill({
        status: response.status(),
        headers: response.headers(),
        body: bodyText,
      });
    } catch (error) {
      console.warn(`Failed to fetch response for ${url}:`, error);
      this.errors.push(url);
      try {
        await route.continue();
      } catch {
        // Page may already be closed
      }
    }
  }

  async save(): Promise<void> {
    for (const page of this.pages) {
      try {
        await page.waitForLoadState("networkidle");
        await page.unrouteAll({ behavior: "ignoreErrors" });
      } catch {
        // Page may already be closed
      }
    }
    await this.waitForInflight();

    if (this.responses.length === 0) {
      console.log(`⚠️  No API calls recorded for ${this.testInfo.file}`);
      return;
    }

    console.log(
      `📝 Recording ${this.responses.length} API responses for ${this.testInfo.titlePath.join(" > ")}`,
    );

    await generatePlaywrightMocks(this.responses, this.testInfo);

    if (this.errors.length > 0) {
      const urls = this.errors.map((u) => `  - ${u}`).join("\n");
      console.warn(
        `⚠️  Recorder failed to capture ${this.errors.length} response(s) (likely context closed during teardown):\n${urls}`,
      );
    }
  }
}

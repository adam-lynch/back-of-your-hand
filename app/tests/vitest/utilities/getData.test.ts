/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../source/api", () => ({
  default: {
    fetchResourceList: vi.fn(),
  },
}));

import { fetchOverpassWithFallback } from "../../../source/utilities/getData";
import { OVERPASS_ENDPOINTS } from "../../../source/utilities/overpassEndpoints";

const makeResponse = (status: number, body?: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as Response;

describe("fetchOverpassWithFallback", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("falls back to the next endpoint on retryable failures", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock
      .mockResolvedValueOnce(makeResponse(504))
      .mockResolvedValueOnce(makeResponse(504))
      .mockResolvedValueOnce(makeResponse(200, { elements: [] }));

    const result = await fetchOverpassWithFallback("query");

    expect(result).toEqual({ elements: [] });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
    expect(fetchMock.mock.calls[1]?.[0]).toBe(OVERPASS_ENDPOINTS[1].url);
    expect(fetchMock.mock.calls[2]?.[0]).toBe(OVERPASS_ENDPOINTS[2].url);
  });

  it("does not retry on non-retryable status codes", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce(makeResponse(400));

    await expect(fetchOverpassWithFallback("query")).rejects.toThrow(
      "Failed to retrieve street data from third-party OpenStreetMap data provider (Overpass) (400)",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
  });

  it("retries on other retryable status codes", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock
      .mockResolvedValueOnce(makeResponse(429))
      .mockResolvedValueOnce(makeResponse(200, { elements: [] }));

    const result = await fetchOverpassWithFallback("query");

    expect(result).toEqual({ elements: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
    expect(fetchMock.mock.calls[1]?.[0]).toBe(OVERPASS_ENDPOINTS[1].url);
  });

  it("stops on a different non-retryable 4xx response", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce(makeResponse(403));

    await expect(fetchOverpassWithFallback("query")).rejects.toThrow(
      "Failed to retrieve street data from third-party OpenStreetMap data provider (Overpass) (403)",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
  });

  it("continues after a network error and succeeds", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock
      .mockRejectedValueOnce(new TypeError("NetworkError"))
      .mockResolvedValueOnce(makeResponse(200, { elements: [] }));

    const result = await fetchOverpassWithFallback("query");

    expect(result).toEqual({ elements: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
    expect(fetchMock.mock.calls[1]?.[0]).toBe(OVERPASS_ENDPOINTS[1].url);
  });

  it("throws when a successful response cannot be parsed", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Unexpected token");
      },
    } as Response);

    await expect(fetchOverpassWithFallback("query")).rejects.toThrow(
      "Cannot parse street data from third-party OpenStreetMap data provider (Overpass).",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
  });

  it("reports failure after all endpoints fail", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    for (let i = 0; i < OVERPASS_ENDPOINTS.length; i += 1) {
      fetchMock.mockResolvedValueOnce(makeResponse(504));
    }

    try {
      await fetchOverpassWithFallback("query");
      throw new Error("Expected fetchOverpassWithFallback to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toContain(
          `Failed to retrieve street data. ${OVERPASS_ENDPOINTS.length} third-party OpenStreetMap data providers have failed (Overpass)`,
        );
        expect(error.message).toContain(
          `Attempts: ${OVERPASS_ENDPOINTS[0].url}=504`,
        );
      }
    }
    expect(fetchMock).toHaveBeenCalledTimes(OVERPASS_ENDPOINTS.length);
  });
});

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import Page from "./Page.svelte";
  import getInternalRoutes from "./routing/getInternalRoutes";
  import { OVERPASS_ENDPOINTS } from "../utilities/overpassEndpoints";

  // @ts-expect-error ...
  declare const COMMIT_ID: string;

  type FailureKind =
    | "network_error"
    | "http_error"
    | "opaque_or_cors"
    | "unknown";

  type DiagnosticRequest = {
    headers: Record<string, string>;
    method: string;
    url: string;
  };

  type DiagnosticResponse = {
    headers: Record<string, string> | null;
    status: number | null;
    statusText: string | null;
    type: Response["type"] | null;
  };

  type DiagnosticError = {
    message: string;
    name: string;
  };

  type DiagnosticAttempt = {
    elapsedMs: number;
    error?: DiagnosticError;
    failureBody?: string;
    failureKind?: FailureKind;
    response: DiagnosticResponse;
  };

  type DiagnosticResult = {
    attempts: DiagnosticAttempt[];
    id: string;
    name: string;
    request: DiagnosticRequest;
  };

  type DiagnosticTest = {
    id: string;
    name: string;
    request: {
      body?: string;
      headers?: Record<string, string>;
      method: string;
      url: string;
    };
    retriesByStatus?: Record<number, number>;
  };

  const MAX_FAILURE_BODY_CHARS = 2000;
  const RETRY_DELAY_BASE_MS = 1000;

  const internalRoute = getInternalRoutes().diagnostics;

  const overpassDisplayNamesById: Record<string, string> = {
    "overpass-primary": "Overpass primary",
    "overpass-z": "Overpass Z",
    "overpass-lz4": "Overpass LZ4",
    "private-coffee": "Overpass Private Coffee",
  };

  const overpassTests: DiagnosticTest[] = OVERPASS_ENDPOINTS.map(
    ({ id, url }) => ({
      id,
      name: overpassDisplayNamesById[id] ?? id,
      request: {
        body: "[out:json];node(0,0,0,0);out;",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        method: "POST",
        url,
      },
      retriesByStatus: { 504: 3 },
    }),
  );

  const tests: DiagnosticTest[] = [
    ...overpassTests,
    {
      id: "versatiles-sprites",
      name: "Versatiles sprites",
      request: {
        method: "GET",
        url: "https://tiles.versatiles.org/assets/sprites/basics/sprites.json",
      },
    },
    {
      id: "versatiles-tile",
      name: "Versatiles tile",
      request: {
        method: "GET",
        url: "https://tiles.versatiles.org/tiles/osm/12/1102/1541",
      },
    },
  ];

  let results: DiagnosticResult[] = [];
  let isRunning = false;
  let clipboardWarning = "";
  let hasCopied = false;
  let environmentInfo: Record<string, unknown> = {};
  let failedCount = 0;
  let passedCount = 0;
  let summaryText = "";
  let resultsById: Record<string, DiagnosticResult> = {};
  let displayItems: Array<{
    test: DiagnosticTest;
    result?: DiagnosticResult;
    finalAttempt?: DiagnosticAttempt;
    isPending: boolean;
    isFailure: boolean;
    isSuccess: boolean;
  }> = [];

  const headersToObject = (headers: Headers) =>
    Object.fromEntries(Array.from(headers.entries()));

  const classifyFailureKind = (input: {
    response?: Response;
    error?: unknown;
  }): FailureKind | undefined => {
    if (input.response) {
      if (input.response.type === "opaque") {
        return "opaque_or_cors";
      }
      if (!input.response.ok) {
        return "http_error";
      }
      return undefined;
    }

    if (input.error instanceof TypeError) {
      return "network_error";
    }

    return "unknown";
  };

  const readFailureBody = async (response: Response) => {
    if (response.type === "opaque") {
      return undefined;
    }
    try {
      const text = await response.text();
      if (text.length > MAX_FAILURE_BODY_CHARS) {
        return `${text.slice(0, MAX_FAILURE_BODY_CHARS)}…`;
      }
      return text;
    } catch (error) {
      console.warn("Diagnostics: unable to read failure body", error);
      return undefined;
    }
  };

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const runTest = async (test: DiagnosticTest): Promise<DiagnosticResult> => {
    const requestHeaders = test.request.headers ?? {};
    const requestInfo: DiagnosticRequest = {
      headers: requestHeaders,
      method: test.request.method,
      url: test.request.url,
    };
    const remainingRetriesByStatus = test.retriesByStatus
      ? { ...test.retriesByStatus }
      : {};
    let retryCount = 0;
    let attempts: DiagnosticAttempt[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const start = performance.now();
      try {
        const response = await fetch(test.request.url, {
          body: test.request.body,
          cache: "no-store",
          headers: requestHeaders,
          method: test.request.method,
        });
        const elapsedMs = Math.round(performance.now() - start);
        const shouldRetry =
          !response.ok && (remainingRetriesByStatus[response.status] ?? 0) > 0;
        const responseInfo: DiagnosticResponse = {
          headers: headersToObject(response.headers),
          status: response.status,
          statusText: response.statusText,
          type: response.type,
        };
        const failureKind = classifyFailureKind({ response });
        const failureBody =
          !shouldRetry && failureKind === "http_error"
            ? await readFailureBody(response)
            : undefined;

        attempts.push({
          elapsedMs,
          failureBody,
          failureKind,
          response: responseInfo,
        });

        if (shouldRetry) {
          remainingRetriesByStatus[response.status] -= 1;
          retryCount += 1;
          await wait(RETRY_DELAY_BASE_MS * retryCount);
          continue;
        }

        return {
          attempts,
          id: test.id,
          name: test.name,
          request: requestInfo,
        };
      } catch (error) {
        const elapsedMs = Math.round(performance.now() - start);
        const failureKind = classifyFailureKind({ error });
        const responseInfo: DiagnosticResponse = {
          headers: null,
          status: null,
          statusText: null,
          type: null,
        };
        const errorInfo = {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : "UnknownError",
        };

        attempts.push({
          elapsedMs,
          error: errorInfo,
          failureKind,
          response: responseInfo,
        });

        return {
          attempts,
          id: test.id,
          name: test.name,
          request: requestInfo,
        };
      }
    }
  };

  const runDiagnostics = async () => {
    isRunning = true;
    hasCopied = false;
    clipboardWarning = "";
    results = [];

    for (const test of tests) {
      try {
        const result = await runTest(test);
        results = [...results, result];
      } catch (error) {
        console.warn("Diagnostics: unexpected test runner error", error);
        const requestInfo: DiagnosticRequest = {
          headers: test.request.headers ?? {},
          method: test.request.method,
          url: test.request.url,
        };
        const errorInfo = {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : "UnknownError",
        };
        const responseInfo: DiagnosticResponse = {
          headers: null,
          status: null,
          statusText: null,
          type: null,
        };
        results = [
          ...results,
          {
            attempts: [
              {
                elapsedMs: 0,
                error: errorInfo,
                failureKind: "unknown",
                response: responseInfo,
              },
            ],
            id: test.id,
            name: test.name,
            request: requestInfo,
          },
        ];
      }
    }

    isRunning = false;
  };

  const copyResults = async () => {
    try {
      const payload = {
        environment: environmentInfo,
        generatedAt: new Date().toISOString(),
        results,
      };
      await navigator.clipboard.writeText(JSON.stringify(payload));
      hasCopied = true;
      clipboardWarning = "";
    } catch (error) {
      console.warn("Diagnostics: clipboard write failed", error);
      clipboardWarning =
        "Clipboard access failed. Please copy the results manually.";
      hasCopied = false;
    }
  };

  onMount(async () => {
    const urlSearchParameters = new URLSearchParams(window.location.search);
    const shouldBypassSW = urlSearchParameters.has("bypassSW");

    if (shouldBypassSW && "serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );
        window.location.reload();
        return;
      }
    }

    const navigatorWithConnection = navigator as Navigator & {
      connection?: { effectiveType?: string; type?: string };
    };
    const effectiveConnectionType =
      navigatorWithConnection.connection?.effectiveType ?? "unknown";
    const networkType = navigatorWithConnection.connection?.type ?? "unknown";
    const viewportWidth = String(window.innerWidth);
    const viewportHeight = String(window.innerHeight);
    const devicePixelRatio = String(window.devicePixelRatio ?? "unknown");
    const serviceWorkerState =
      "serviceWorker" in navigator
        ? navigator.serviceWorker.controller
          ? "controlled"
          : "no-controller"
        : "unsupported";

    environmentInfo = {
      commitId: typeof COMMIT_ID === "string" ? COMMIT_ID : "unknown",
      devicePixelRatio,
      language: navigator.language,
      network: {
        effectiveType: effectiveConnectionType,
        type: networkType,
      },
      serviceWorkerState,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
      viewport: {
        height: viewportHeight,
        width: viewportWidth,
      },
    };
    if (navigator.storage?.estimate) {
      navigator.storage
        .estimate()
        .then((estimate) => {
          environmentInfo = {
            ...environmentInfo,
            storage: {
              quotaBytes: estimate.quota ? String(estimate.quota) : "unknown",
              usageBytes: estimate.usage ? String(estimate.usage) : "unknown",
            },
          };
        })
        .catch((error) => {
          console.warn("Diagnostics: storage estimate failed", error);
          environmentInfo = {
            ...environmentInfo,
            storage: {
              quotaBytes: "unknown",
              usageBytes: "unknown",
            },
          };
        });
    } else {
      environmentInfo = {
        ...environmentInfo,
        storage: {
          quotaBytes: "unsupported",
          usageBytes: "unsupported",
        },
      };
    }
    runDiagnostics();
  });

  $: failedCount = results.filter((result) => {
    const attempts = result.attempts ?? [];
    const finalAttempt =
      attempts.length > 0 ? attempts[attempts.length - 1] : undefined;
    return finalAttempt?.failureKind || finalAttempt?.error;
  }).length;
  $: passedCount = results.filter((result) => {
    const attempts = result.attempts ?? [];
    const finalAttempt =
      attempts.length > 0 ? attempts[attempts.length - 1] : undefined;
    return finalAttempt && !finalAttempt.failureKind && !finalAttempt.error;
  }).length;
  $: resultsById = results.reduce(
    (accumulator, result) => {
      accumulator[result.id] = result;
      return accumulator;
    },
    {} as Record<string, DiagnosticResult>,
  );
  $: displayItems = tests.map((test) => {
    const result = resultsById[test.id];
    const attempts = result?.attempts ?? [];
    const finalAttempt =
      attempts.length > 0 ? attempts[attempts.length - 1] : undefined;
    const isPending = isRunning && !finalAttempt;
    const isFailure = !!(
      finalAttempt &&
      (finalAttempt.failureKind || finalAttempt.error)
    );
    const isSuccess = !!(finalAttempt && !isFailure);
    return {
      finalAttempt,
      isFailure,
      isPending,
      isSuccess,
      result,
      test,
    };
  });
  $: summaryText = isRunning
    ? "Summary: ..."
    : `Summary: ${passedCount} passed, ${failedCount} failed.`;
</script>

<Page
  {internalRoute}
  shouldHaveAppHeader={false}
>
  <main class="diagnostics">
    <header class="diagnostics__header">
      <div>
        <h1>Diagnostics</h1>
        <p>
          This page runs a fixed set of connectivity checks and records metadata
          only.
        </p>
      </div>
      <div class="diagnostics__actions">
        <button
          on:click={runDiagnostics}
          disabled={isRunning}
        >
          {isRunning ? "Running…" : "Run again"}
        </button>
        <button
          on:click={copyResults}
          disabled={isRunning || results.length === 0}
        >
          Copy results
        </button>
        {#if hasCopied}
          <span class="diagnostics__status">Copied!</span>
        {/if}
      </div>
    </header>

    {#if clipboardWarning}
      <p class="diagnostics__warning">{clipboardWarning}</p>
    {/if}

    <p class="diagnostics__summary">{summaryText}</p>

    <section class="diagnostics__results">
      {#each displayItems as item}
        <article
          class="diagnostics__card"
          class:diagnostics__card--failed={item.isFailure}
          class:diagnostics__card--success={item.isSuccess}
        >
          <header class="diagnostics__card-header">
            <h2 class="diagnostics__card-title">{item.test.name}</h2>
          </header>
          {#if item.isPending}
            <p class="diagnostics__pending">Running...</p>
          {:else}
            <div class="diagnostics__card-grid">
              <div>
                <div class="diagnostics__label">Outcome</div>
                <div class="diagnostics__value">
                  {#if item.isFailure}
                    ❌ Failed
                  {:else if item.isSuccess}
                    ✅ Passed
                  {:else}
                    —
                  {/if}
                </div>
              </div>
              <div>
                <div class="diagnostics__label">HTTP status</div>
                <div class="diagnostics__value">
                  {#if item.finalAttempt?.response?.status != null}
                    {item.finalAttempt?.response?.status}
                    {item.finalAttempt?.response?.statusText}
                  {:else}
                    —
                  {/if}
                </div>
              </div>
              {#if item.isFailure}
                <div>
                  <div class="diagnostics__label">Failure kind</div>
                  <div class="diagnostics__value"
                    >{item.finalAttempt?.failureKind ?? "—"}</div
                  >
                </div>
                <div>
                  <div class="diagnostics__label">Error</div>
                  <div class="diagnostics__value"
                    >{item.finalAttempt?.error?.message ?? "—"}</div
                  >
                </div>
              {/if}
            </div>
            <details class="diagnostics__card-details">
              <summary>Details</summary>
              {#if item.result}
                <p>
                  <span class="diagnostics__label">Request info</span>
                </p>
                <pre>{JSON.stringify(item.result.request, null, 2)}</pre>
                {#if item.result.attempts.length > 0}
                  <div class="diagnostics__attempts">
                    {#each item.result.attempts as attempt, index}
                      <p class="diagnostics__attempt">
                        <span class="diagnostics__label"
                          >Attempt {index + 1}</span
                        >
                      </p>
                      <pre>{JSON.stringify(attempt, null, 2)}</pre>
                    {/each}
                  </div>
                {/if}
              {:else}
                <p class="diagnostics__muted">No results yet.</p>
              {/if}
            </details>
          {/if}
        </article>
      {/each}
    </section>
  </main>
</Page>

<style>
  .diagnostics {
    color: #f3f3f3;
    padding: 16px;
    line-height: 1.5;
  }

  .diagnostics__header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }

  .diagnostics__actions {
    display: flex;
    align-items: stretch;
    gap: 10px;
    flex-direction: column;
    width: 100%;
  }

  .diagnostics__actions button {
    background: #3a133e;
    border: 1px solid #5b205f;
    color: #fff;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
  }

  .diagnostics__actions button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .diagnostics__actions button:not(:disabled):hover {
    background: #4a184f;
    border-color: #6a2670;
  }

  .diagnostics__status {
    color: #9ee493;
    font-weight: 600;
  }

  .diagnostics__warning {
    background: #331018;
    border: 1px solid #5e1f2f;
    color: #ffb5c0;
    padding: 10px 12px;
    border-radius: 6px;
  }

  .diagnostics__summary {
    margin: 18px 0 10px;
    font-weight: 600;
    font-size: 1rem;
    color: #e8d9ea;
  }

  .diagnostics__results {
    display: grid;
    gap: 14px;
    margin-top: 14px;
  }

  .diagnostics__card {
    background: #140616;
    border: 1px solid #2c102f;
    border-radius: 8px;
    padding: 16px;
  }

  .diagnostics__card--failed {
    border-color: #5e1f2f;
    background: rgba(255, 88, 123, 0.18);
  }

  .diagnostics__card--success {
    border-color: #1f5e2b;
    background: rgba(110, 240, 140, 0.18);
  }

  .diagnostics__card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
  }

  .diagnostics__card-title {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.3;
  }

  .diagnostics__card-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-top: 14px;
  }

  .diagnostics__label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #c3a7c7;
    margin-bottom: 6px;
  }

  .diagnostics__card--failed .diagnostics__label,
  .diagnostics__card--success .diagnostics__label {
    color: #ebe3ed;
  }

  .diagnostics__value {
    font-size: 0.95rem;
    color: #f3f3f3;
    word-break: break-word;
    line-height: 1.4;
  }

  .diagnostics__pending {
    font-size: 1rem;
    margin: 14px 0 0;
    color: #d9d9d9;
    font-weight: 600;
  }

  .diagnostics__card-details {
    margin-top: 14px;
  }

  .diagnostics__card-details summary {
    cursor: pointer;
    color: #d9d9d9;
    font-weight: 600;
  }

  .diagnostics__card-details pre {
    white-space: pre-wrap;
    word-break: break-word;
    color: #d9d9d9;
    margin-top: 10px;
    line-height: 1.45;
  }

  .diagnostics__attempts {
    margin-top: 12px;
    display: grid;
    gap: 8px;
  }

  .diagnostics__attempt {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .diagnostics__muted {
    color: #b9b0bc;
    margin-top: 10px;
  }

  @media (min-width: 640px) {
    .diagnostics {
      padding: 20px;
    }

    .diagnostics__actions {
      flex-direction: row;
      align-items: center;
      width: auto;
    }

    .diagnostics__actions button {
      width: auto;
    }

    .diagnostics__card {
      padding: 18px;
    }

    .diagnostics__card-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (min-width: 960px) {
    .diagnostics {
      padding: 24px;
    }

    .diagnostics__header {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>

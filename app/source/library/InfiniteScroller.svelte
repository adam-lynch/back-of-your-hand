<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import * as svelteStore from "svelte/store";
  import { onMount } from "svelte";

  import type { MaybePromise } from "../utilities/utilityTypes";
  import combineClasses from "./utilities/combineClasses";
  import LoadingIndicator from "./LoadingIndicator.svelte";

  export let canLoadMore = true;
  export let loadMore: () => MaybePromise<void>;

  let endElement: HTMLElement;
  const isLoading = svelteStore.writable(true);

  onMount(() => {
    const intersectionObserver = new IntersectionObserver(
      async (entries, observer) => {
        const entry = entries[0];
        if (!entry.isIntersecting || !canLoadMore) {
          return;
        }
        isLoading.set(true);
        await loadMore();
        isLoading.set(false);

        if (endElement instanceof Element) {
          observer.unobserve(endElement);
          requestAnimationFrame(() => {
            if (endElement instanceof Element) {
              observer.observe(endElement);
            }
          });
        }
      },
      {
        root: endElement.closest(".route-wrapper"),
        rootMargin: "0px 0px 750px 0px",
        threshold: 0,
      },
    );
    if (endElement instanceof Element) {
      intersectionObserver.observe(endElement);
    }

    return () => {
      intersectionObserver.disconnect();
    };
  });
</script>

<div
  {...$$restProps}
  class={combineClasses("infinite-scroller__wrapper", $$restProps.class)}
>
  <slot name="main" />

  <div bind:this={endElement}>
    {#if $isLoading}
      <slot name="loading-indicator">
        <LoadingIndicator />
      </slot>
    {/if}
  </div>
</div>

<style>
</style>

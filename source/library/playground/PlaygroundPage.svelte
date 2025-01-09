<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { derived, writable } from "svelte/store";
  import type { Theme } from "../themes";

  export let isDarkMode = writable(true);
  export let title = "";

  const pageTheme = derived<[typeof isDarkMode], Theme>(
    [isDarkMode],
    ([$isDarkMode]) => ($isDarkMode ? "dark" : "light"),
  );
</script>

<div
  id="components-playground"
  class={$isDarkMode
    ? "components-playground--dark-mode"
    : "components-playground--light-mode"}
>
  <h2>{title}</h2>

  <label for="theme">
    <input
      bind:checked={$isDarkMode}
      id="theme"
      type="checkbox"
    />
    Dark mode
  </label>

  <slot pageTheme={$pageTheme} />
</div>

<style>
  :global(.route-wrapper) {
    overflow: auto;

    &:has(.components-playground--dark-mode) {
      background: #0d030d !important;
      color: white;
    }

    &:has(.components-playground--light-mode) {
      background: white !important;
      color: black;
    }
  }

  #components-playground {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
</style>

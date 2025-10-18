<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import type { Theme } from "../themes";
  import combineClasses from "../utilities/combineClasses";

  export let theme: Theme = "dark";
  export let checked: boolean | undefined = false;
</script>

<input
  {...$$restProps}
  bind:checked
  class={combineClasses(
    "checkbox",
    `checkbox--theme-${theme}`,
    $$restProps.class,
  )}
  on:*
  type="checkbox"
/>

<style>
  .checkbox {
    --_focused-shadow-color-light: hsl(210 100% 40% / 10%);
    --_focused-shadow-color-dark: hsl(0 0% 40% / 40%);
    --_focused-shadow-color: var(--_focused-shadow-color-light);

    --_transition-motion-reduce: ;
    --_transition-motion-ok: box-shadow 145ms ease;
    --_transition: var(--_transition-motion-reduce);

    height: 1rem;
    width: 1rem;
    accent-color: #922b56;
    outline: none;
    transition: var(--_transition);

    &:where(.checkbox--theme-dark) {
      --_focused-shadow-color: var(--_focused-shadow-color-dark);
      --_invalid-outline-color: var(--_invalid-outline-color-dark);
      border: 2px solid green;
    }

    &:focus-visible {
      box-shadow: 0 0 0 0.3rem var(--_focused-shadow-color);
    }

    &[aria-invalid="true"]:not([disabled]) {
      --_focused-shadow-color-light: hsl(0 100% 60% / 20%);
      --_focused-shadow-color-dark: hsl(0 100% 60% / 30%);

      /* Shown even when not focused */
      box-shadow: 0 0 0 0.3rem var(--_focused-shadow-color);

      &:focus-visible {
        /* Increase opacity */
        --_focused-shadow-color-light: hsl(0 100% 60% / 35%);
        --_focused-shadow-color-dark: hsl(0 100% 60% / 50%);
      }
    }

    &[disabled] {
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: no-preference) {
      --_transition: var(--_transition-motion-ok);
    }
  }
</style>

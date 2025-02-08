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

  export let placeholder: string | undefined =
    $$restProps.placeholder ||
    (!$$restProps.disabled &&
    !$$restProps.readonly &&
    $$restProps.type === "email"
      ? "hello@example.com"
      : undefined);
  export let theme: Theme = "dark";
  export let value = "";
</script>

<input
  {...$$restProps}
  bind:value
  class={combineClasses(
    "text-input",
    `text-input--theme-${theme}`,
    $$restProps.class,
  )}
  {placeholder}
  on:*
/>

<style>
  .text-input {
    --_background-light: hsl(210deg 9% 94%);
    --_background-dark: hsl(210deg 9% 31% / 27%);
    --_background: var(--_background-light);

    --_background-disabled-light: hsl(210deg 9% 88%);
    --_background-disabled-dark: hsl(210deg 9% 21% / 20%);
    --_background-disabled: var(--_background-disabled-light);

    --_border-color: transparent;
    --_border-size: 1px;

    --_focused-border-color-light: var(--focus-accent-color-light);
    --_focused-border-color-dark: hsl(0 0% 20%);
    --_focused-border-color: var(--_focused-border-color-light);

    --_focused-shadow-color-light: hsl(210 100% 40% / 10%);
    --_focused-shadow-color-dark: hsl(0 0% 40% / 10%);
    --_focused-shadow-color: var(--_focused-shadow-color-light);

    --_padding-inline: 1ch;
    --_padding-block: 0.75ch;

    --_placeholder-color-light: hsl(0 0% 75%);
    --_placeholder-color-dark: hsl(0 0% 35%);
    --_placeholder-color: var(--_placeholder-color-light);

    --_text-light: #212529;
    --_text-dark: #fff;
    --_text: var(--_text-light);

    --_transition-motion-reduce: ;
    --_transition-motion-ok: box-shadow 145ms ease, border-color 145ms ease;
    --_transition: var(--_transition-motion-reduce);

    background: var(--_background);
    border: var(--_border-size) solid var(--_border-color);
    border-radius: 5px;
    color: var(--_text);
    font-size: 1rem;
    outline: none;
    padding-inline: var(--_padding-inline);
    padding-block: var(--_padding-block);
    transition: var(--_transition);

    &::placeholder {
      color: var(--_placeholder-color);
    }

    &:where(.text-input--theme-dark) {
      --_background: var(--_background-dark);
      --_background-disabled: var(--_background-disabled-dark);
      --_focused-border-color: var(--_focused-border-color-dark);
      --_focused-shadow-color: var(--_focused-shadow-color-dark);
      --_placeholder-color: var(--_placeholder-color-dark);
      --_text: var(--_text-dark);
    }

    &:focus-visible {
      --_border-color: var(--_focused-border-color);
      box-shadow: 0 0 0 0.3rem var(--_focused-shadow-color);
    }

    &[aria-invalid="true"]:not([disabled], [readonly]) {
      --_border-color: var(--_focused-border-color);
      --_focused-border-color-light: red;
      --_focused-border-color-dark: rgb(190, 0, 0);
      --_focused-shadow-color-light: hsl(0 100% 60% / 15%);
      --_focused-shadow-color-dark: hsl(0 100% 60% / 15%);
    }

    &[disabled],
    &[readonly] {
      --_text: hsl(210 10% 50%);
    }

    &[readonly] {
      --_focused-border-color-light: var(--_text);
      cursor: default;
      user-select: none;
    }

    &[disabled] {
      --_background: var(--_background-disabled);
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: no-preference) {
      --_transition: var(--_transition-motion-ok);
    }
  }
</style>

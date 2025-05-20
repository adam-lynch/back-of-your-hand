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

  export let options: {
    label: string;
    value: string;
  }[];
  export let theme: Theme = "dark";
  export let value = options.find(Boolean)?.value;
</script>

<select
  {...$$restProps}
  bind:value
  class={combineClasses(
    "select-input",
    `select-input--theme-${theme}`,
    $$restProps.class,
  )}
  on:*
>
  {#each options as option}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>

<style>
  .select-input {
    --_background-color-light: hsl(210deg 9% 94%);
    --_background-color-dark: hsl(210deg 9% 31% / 27%);
    --_background-image: var(--_background-color-light);
    --_background-color-disabled-light: hsl(210deg 9% 88%);
    --_background-color-disabled-dark: hsl(210deg 9% 21% / 20%);
    --_background-color-disabled: var(--_background-color-disabled-light);

    /* fill matches --text */
    --_background-image-light: url("data:image/svg+xml;utf8,<svg fill='%23212529' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
    --_background-image-dark: url("data:image/svg+xml;utf8,<svg fill='%23fff' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
    --_background-image: var(--_background-image-light);
    --_background-image-disabled: url("data:image/svg+xml;utf8,<svg fill='hsl(210, 10%, 50%)' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");

    --_border-color: transparent;
    --_border-size: 1px;

    --_focused-border-color-light: var(--focus-accent-color-light);
    --_focused-border-color-dark: hsl(0 0% 20%);
    --_focused-border-color: var(--_focused-border-color-light);

    --_focused-shadow-color-light: hsl(210 100% 40% / 10%);
    --_focused-shadow-color-dark: hsl(0 0% 40% / 10%);
    --_focused-shadow-color: var(--_focused-shadow-color-light);

    --_padding-inline: 1ch;
    --_padding-block: 0.5ch;

    --_text-light: #212529;
    --_text-dark: #fff;
    --_text: var(--_text-light);

    --_transition-motion-reduce: ;
    --_transition-motion-ok: box-shadow 145ms ease, border-color 145ms ease;
    --_transition: var(--_transition-motion-reduce);

    appearance: none;
    background-color: var(--_background-color);
    background-image: var(--_background-image);
    background-repeat: no-repeat;
    background-position: right 0.1em center;
    background-size: 1.5em;
    color: var(--_text);
    font-size: 1rem;
    outline: none;
    padding-left: var(--_padding-inline);
    padding-right: calc(var(--_padding-inline) + 1em); /* extra for arrow */
    padding-block: var(--_padding-block);
    border: var(--_border-size) solid var(--_border-color);
    border-radius: 5px;
    transition: var(--_transition);

    &:where(.select-input--theme-dark) {
      --_background-color: var(--_background-color-dark);
      --_background-color-disabled: var(--_background-color-disabled-dark);
      --_background-image: var(--_background-image-dark);
      --_focused-border-color: var(--_focused-border-color-dark);
      --_focused-shadow-color: var(--_focused-shadow-color-dark);
      --_placeholder-color: var(--_placeholder-color-dark);
      --_text: var(--_text-dark);
    }

    &:focus-visible {
      --_border-color: var(--_focused-border-color);
      box-shadow: 0 0 0 0.3rem var(--_focused-shadow-color);
    }

    &[aria-invalid="true"]:not([disabled]) {
      --_border-color: var(--_focused-border-color);
      --_focused-border-color-light: red;
      --_focused-border-color-dark: rgb(190, 0, 0);
      --_focused-shadow-color-light: hsl(0 100% 60% / 15%);
      --_focused-shadow-color-dark: hsl(0 100% 60% / 15%);
    }

    &[disabled] {
      --_background-color: var(--_background-color-disabled);
      --_background-image: var(--_background-image-disabled);
      --_text: hsl(210 10% 50%);
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: no-preference) {
      --_transition: var(--_transition-motion-ok);
    }

    & option {
      background-color: var(--_background);
    }

    &:where(.select-input--theme-dark) option {
      background-color: #57265a; /* Can't have alpha */
    }
  }
</style>

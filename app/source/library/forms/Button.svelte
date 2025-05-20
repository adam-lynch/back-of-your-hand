<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<!-- Heavily inspired by https://web.dev/articles/building/a-button-component -->
<script lang="ts">
  import { type Builder, Button } from "bits-ui";
  import DangerIcon from "~icons/solar/danger-circle-line-duotone";
  import combineClasses from "../utilities/combineClasses";
  import ButtonContent from "./ButtonContent.svelte";
  import type { Theme } from "../themes";

  export let builders: Builder[] = [];
  export let size: "small" | "medium" | "large" = "medium";
  export let tagName: "a" | "button" | "input" = $$restProps.href
    ? "a"
    : "button";
  export let theme: Theme = "dark";
  export let type: "button" | "reset" | "submit" | undefined = "button";
  export let value = "";
  export let variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "text"
    | "unstyled" = type === "submit" ? "primary" : "tertiary";
  export let consequence: "destruction" | undefined =
    variant !== "unstyled" && type === "reset" ? "destruction" : undefined;
  export let Icon = consequence === "destruction" ? DangerIcon : undefined;

  const classes: string[] = [
    "button",
    `button--size-${size}`,
    `button--theme-${theme}`,
    `button--variant-${variant}`,
    $$restProps.class,
  ];

  if (consequence) {
    classes.push(`button--consequence-${consequence}`);
  }

  const className = combineClasses(...classes);

  const onClick = (event: MouseEvent) => {
    if ($$restProps.disabled) {
      event.preventDefault();
    }
  };
</script>

{#if tagName === "input"}
  <input
    {...$$restProps}
    {builders}
    class={className}
    on:*
    on:click={onClick}
    {type}
    {value}
  />
{:else}
  <Button.Root
    {...$$restProps}
    {builders}
    class={className}
    {...{
      // @ts-expect-error bits-ui isn't compatible with `on:*`
    }}
    on:*
    on:click={onClick}
    {type}
  >
    <ButtonContent {Icon}>
      <slot>{value}</slot>
    </ButtonContent>
  </Button.Root>
{/if}

<style>
  :global(.button) {
    --_accent-light: hsl(210 100% 40%);
    --_accent-dark: hsl(210 50% 70%);
    --_accent: var(--_accent-light);

    --_background-light: hsl(0 0% 99%);
    --_background-dark: hsl(210deg 9% 31% / 60%);
    --_background: var(--_background-light);

    --_border-radius: 2rem;
    --_border-light: hsl(210 14% 89%);
    --_border-dark: var(--_background-dark);
    --_border: var(--_border-light);

    --_highlight-size: 0;
    --_highlight-light: hsl(210 10% 71% / 25%);
    --_highlight-dark: hsl(210 10% 71% / 8%);
    --_highlight: var(--_highlight-light);

    --_icon-size: 2ch;
    --_icon-color: var(--_accent);

    --_ink-shadow-light: none;
    --_ink-shadow-dark: 0 1px 0 hsl(210 11% 15%);
    --_ink-shadow: var(--_ink-shadow-light);

    --_input-well-light: hsl(210 16% 87%);
    --_input-well-dark: hsl(204 10% 10%);
    --_input-well: var(--_input-well-light);

    --_outline-color-light: var(--focus-accent-color-light);
    --_outline-color-dark: var(--focus-accent-color-dark);
    --_outline-color: var(--_outline-color-light);
    --_outline-size: 0px;

    --_padding-inline: 1ch;
    --_padding-block: 0.5ch;

    --_shadow-color-light: 220 3% 15%;
    --_shadow-color-dark: 220 40% 2%;
    --_shadow-color: var(--_shadow-color-light);
    --_shadow-strength-light: 1%;
    --_shadow-strength-dark: 25%;
    --_shadow-strength: var(--_shadow-strength-light);
    --_shadow-1: 0 1px 2px -1px hsl(var(--_shadow-color) /
          calc(var(--_shadow-strength) + 9%));
    --_shadow-2: 0 3px 5px -2px hsl(var(--_shadow-color) /
            calc(var(--_shadow-strength) + 3%)),
      0 7px 14px -5px hsl(var(--_shadow-color) /
            calc(var(--_shadow-strength) + 5%));
    --_shadow-depth-light: 0 1px var(--_border-light);
    --_shadow-depth-dark: 0 1px var(--_background-dark);
    --_shadow-depth: var(--_shadow-depth-light);

    --_text-light: hsl(210 10% 30%);
    --_text-dark: #fff;
    --_text: var(--_text-light);

    --_transition-motion-reduce: ;
    --_transition-motion-ok: box-shadow 145ms ease, outline-offset 145ms ease;
    --_transition: var(--_transition-motion-reduce);

    &:where(.button--variant-unstyled) {
      border: 0;
      background: none;
      cursor: pointer;
    }

    &:where(:not(.button--variant-unstyled)) {
      &,
      &:where(input[type="file"])::file-selector-button {
        font: inherit;
        letter-spacing: inherit;
        line-height: 1.5;
        border-radius: var(--_border-radius);

        font-size: var(--_size, 1rem);
        background: var(--_background);
        color: var(--_text);
        border: 2px solid var(--_border);
        outline: var(--_outline-size) solid var(--_outline-color);

        box-shadow:
          var(--_shadow-2),
          var(--_shadow-depth),
          0 0 0 var(--_highlight-size) var(--_highlight);
        text-shadow: var(--_ink-shadow);

        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;

        gap: 1ch;
        padding-block: var(--_padding-block);
        padding-inline: var(--_padding-inline);

        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        touch-action: manipulation;

        transition: var(--_transition);
        will-change: transform;
      }

      &:where(:not(.button--variant-text)) {
        text-decoration: none;
      }

      &,
      &:where(:not(input[type="reset"])) {
        &:not(:active):hover {
          --_highlight-size: 0.5rem;
        }
      }

      &:focus-visible {
        --_outline-size: 2px;
      }

      &:where(:not(:active)):focus-visible {
        outline-offset: 5px;

        &:where(.button--variant-text) {
          outline-offset: 8px;
        }
      }

      &:where(:active:not([disabled])) {
        transform: scaleX(0.98) scaleY(0.98);
      }

      &:where(.button--variant-primary, form button:not([type], [disabled])) {
        --_text: var(--_accent);
      }

      &:where(.button--consequence-destruction) {
        --_border-light: hsl(0 100% 83%);
        --_highlight-light: hsl(0 100% 89% / 20%);

        &:where(:not(.button--variant-primary, .button--variant-secondary)) {
          --_text-light: hsl(0 80% 50%);
          --_text-dark: hsl(0 100% 89%);
        }

        &:focus-visible {
          --_outline-color: hsl(0 80% 50%);
        }
      }

      &[disabled] {
        --_background: none;
        --_border: var(--_border-dark);
        --_ink-shadow: none;
        --_text-dark: hsl(210 11% 60%);
        --_text-light: hsl(210 7% 40%);

        box-shadow: var(--_shadow-1);
        cursor: not-allowed;
      }

      &.button--variant-text {
        --_background: none;
        --_border: none;
        --_ink-shadow: none;
        --_padding-block: 0;
        --_padding-inline: 0;
        --_transition: 0;
        box-shadow: none;
      }

      &:where(input[type="file"]) {
        inline-size: 100%;
        max-inline-size: max-content;
        background-color: var(--_input-well);
      }

      &:where(input[type="button"]),
      &:where(input[type="file"])::file-selector-button {
        appearance: none;
      }

      &:where(input[type="file"])::file-selector-button {
        margin-inline-end: var(--_padding-inline);
      }

      &:where(.button--theme-dark) {
        &,
        &:where(input[type="file"])::file-selector-button {
          --_accent: var(--_accent-dark);
          --_background: var(--_background-dark);
          --_border: var(--_border-dark);
          --_highlight: var(--_highlight-dark);
          --_ink-shadow: var(--_ink-shadow-dark);
          --_input-well: var(--_input-well-dark);
          --_outline-color: var(--_outline-color-dark);
          --_shadow-depth: var(--_shadow-depth-dark);
          --_shadow-color: var(--_shadow-color-dark);
          --_shadow-strength: var(--_shadow-strength-dark);
          --_text: var(--_text-dark);
        }
      }

      &:where(.button--variant-primary) {
        --_background: #df206f;
        --_text: var(--_text-dark);

        &:not([disabled]) {
          --_border: #df206f;
        }
      }

      &:where(.button--variant-secondary) {
        --_background: #922b56;
        --_text: var(--_text-dark);

        &:not([disabled]) {
          --_border: #922b56;
        }
      }

      @media (prefers-reduced-motion: no-preference) {
        &,
        &:where(input[type="file"])::file-selector-button {
          --_transition: var(--_transition-motion-ok);
        }
      }
    }

    &:where(.button--size-small) {
      --_size: 0.75rem;
    }

    &:where(.button--size-large) {
      --_size: 1.5rem;
    }
  }
</style>

<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { Link } from "svelte-routing";
  import combineClasses from "./utilities/combineClasses";

  export let className = "";
  export let isExternal = false;
  export let styleLevel: "all" | "all-except-current-related" | "none" = "all";
  export let to = "";

  const classes = [
    "link",
    className,
    $$restProps["class"],
    `link--style-level-${styleLevel}`,
  ];
  const combinedClassName = combineClasses(...classes);

  const getProps: (linkParams: {
    href: string;
    isPartiallyCurrent: boolean;
    isCurrent: boolean;
  }) => Record<string, string> = (args) => {
    const results: Record<string, string> = {};
    if (args.isPartiallyCurrent) {
      results["data-is-partially-current"] = "true";
    }
    return results;
  };
</script>

{#if isExternal}
  <a
    {...$$restProps}
    class={combinedClassName}
    href={to}><slot /></a
  >
{:else}
  <Link
    {...$$restProps}
    class={combinedClassName}
    {getProps}
    {to}><slot /></Link
  >
{/if}

<style>
  :global(:where(.link)) {
    color: inherit;
    text-decoration: none;

    &:not(.link--style-level-none) {
      &:not([data-is-partially-current="true"]),
      &:not(.link--style-level-all-except-current-related) {
        &:hover {
          opacity: 0.8;
        }
      }

      &:active {
        position: relative;
        top: 1px;
      }

      &:not(
          .link--style-level-all-except-current-related
        )[data-is-partially-current="true"] {
        font-weight: 800;
      }
    }
  }
</style>

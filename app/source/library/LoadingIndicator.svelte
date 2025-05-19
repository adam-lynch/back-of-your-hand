<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import HorizontalIcon from "~icons/eos-icons/three-dots-loading";
  import combineClasses from "./utilities/combineClasses";

  export let mode: "inline" | "large" = "inline";
  export let shouldDelayAppearing = true;

  const classes = [
    "loading-indicator",
    `loading-indicator--${mode}`,
    $$restProps.class,
  ];
  if (shouldDelayAppearing) {
    classes.push("loading-indicator--should-delay-appearing");
  }
</script>

<p
  class={combineClasses(...classes)}
  {...$$restProps}
>
  <HorizontalIcon />
</p>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.4;
    }
  }

  .loading-indicator {
    flex: 1;
    font-size: 4rem;
    opacity: 0;
    animation: fadeIn 0.5s ease-in forwards;
  }

  .loading-indicator--should-delay-appearing {
    animation-delay: 0.2s;
  }
</style>

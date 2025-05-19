<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import type { DOMAttributes, HTMLImgAttributes } from "svelte/elements";
  import combineClasses from "./utilities/combineClasses";
  import type { Organization } from "../api/resourceObjects";
  import getInitialsFromString from "../utilities/getInitialsFromString";

  export let imageAttributes: Omit<
    HTMLImgAttributes,
    keyof DOMAttributes<HTMLImageElement>
  > = {};
  export let organizationName: Organization["attributes"]["name"];

  const organizationNameInitials = getInitialsFromString(organizationName)
    .slice(0, 2)
    .join(" ");
</script>

<span
  {...$$restProps}
  class={combineClasses("organization-logo__container", $$restProps["class"])}
>
  {#if imageAttributes.src}
    <img
      {...imageAttributes}
      alt={imageAttributes.alt}
      class={combineClasses(
        "organization-logo__image",
        imageAttributes["class"],
      )}
    />
  {:else}
    <span class="organization-logo__initials">{organizationNameInitials}</span>
  {/if}
</span>

<style>
  .organization-logo__container {
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    overflow: hidden;
  }

  .organization-logo__image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .organization-logo__initials {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 5px;
    font-size: 32px;
  }
</style>

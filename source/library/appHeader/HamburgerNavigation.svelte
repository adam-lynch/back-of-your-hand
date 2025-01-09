<!--
  TODO: show second row when screen is tall enough
-->

<script lang="ts">
  import HamburgerIcon from "~icons/radix-icons/hamburger-menu";

  import Button from "../forms/Button.svelte";
  import combineClasses from "../utilities/combineClasses";
  import navigation from "./navigation";
  import WithNavigationPopover from "./WithNavigationPopover.svelte";

  export let className = "";
  export let buttonClassName = "";

  const filterNavigationItems = () => {
    return $navigation
      .map((item) =>
        item.id === "profile" && item.childItems ? item.childItems : item,
      )
      .flat();
  };
</script>

<WithNavigationPopover
  className={combineClasses(className, "hamburger-navigation")}
  {filterNavigationItems}
  shouldShowChildren={true}
  let:builders
>
  <Button
    {builders}
    class={combineClasses("hamburger-button", buttonClassName)}
    variant="unstyled">Menu <HamburgerIcon /></Button
  >
</WithNavigationPopover>

<style>
  :global(.hamburger-navigation) {
    display: flex;
  }

  :global(.hamburger-button) {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: calc(
      var(--app-header__padding-horizontal) -
        var(--app-header__minimum-horizontal-gap)
    );
    color: #ececec;
  }
</style>

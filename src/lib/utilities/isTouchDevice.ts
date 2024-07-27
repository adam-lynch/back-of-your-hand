// May not be 100% accurate
export default () => {
  if ("ontouchstart" in window || window.TouchEvent) return true;

  // @ts-expect-error ...
  if (window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  const prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
  const queries = prefixes.map((prefix) => `(${prefix}touch-enabled)`);

  return window.matchMedia(queries.join(",")).matches;
};

import type { Round } from "./types";

export default (): Round["seed"] | void => {
  const seedQueryArgument = new URLSearchParams(window.location.search).get(
    "seed"
  );

  if (seedQueryArgument) {
    return seedQueryArgument;
  }

  /* Legacy URL pattern... */

  const pathSegments = window.location.pathname
    .split("/")
    .filter((segment) => segment && segment !== "geo-lookup-done");

  if (pathSegments.length === 2 && pathSegments[1].length) {
    return pathSegments[1];
  }
};

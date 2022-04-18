import ignoreError from "./ignoreError";

const getAreaRadiusFromUrl = (regExpToRemove?: RegExp): number | void => {
  const urlSearchParams = new URLSearchParams(window.location.search);

  if (urlSearchParams.has("radius")) {
    return ignoreError(() => parseFloat(urlSearchParams.get("radius")));
  }
};

const getAreaRadiusFromStorage = (): number | void => {
  const unparsedValue = ignoreError(() => localStorage.getItem("radius"));

  if (unparsedValue) {
    const parsedValue = ignoreError(() => parseInt(unparsedValue));
    return parsedValue;
  }
};

export default () =>
  // Did the user provide one in the URL?
  getAreaRadiusFromUrl() ||
  // Did they play previously?
  getAreaRadiusFromStorage() ||
  // Return the default value.
  2000

import ignoreError from "./ignoreError";

const getAreaRadiusFromUrl = (regExpToRemove?: RegExp): number | void => {
  let pathname = window.location.pathname;

  if (regExpToRemove) {
    pathname = pathname.replace(regExpToRemove, "");
  }

  const segments = pathname.split("/").filter(Boolean);
  const unparsedSegment = segments[0];

  if (unparsedSegment) {
    const unparsedValues = unparsedSegment.split(",");

    if (unparsedValues.length == 2) {
      // Return the default value in case the URL specifies an area center but
      // no radius. This ensures backward compatibility to old links that were
      // created before the radius was added to the path.
      return 2000;
    } else if (unparsedValues.length == 3) {
      const parsedValue = ignoreError(() => parseInt(unparsedValues[2]));
      return parsedValue;
    }
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

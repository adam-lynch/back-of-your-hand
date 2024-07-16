import ignoreError from "./ignoreError";

function getFromUrl<T>({
  name,
  parse,
  urlSearchParams,
}: {
  name: string;
  parse: (input: string | void) => T | void;
  urlSearchParams: URLSearchParams;
}): T | void {
  if (urlSearchParams.has(name)) {
    return parse(ignoreError(() => urlSearchParams.get(name)));
  }
}

function getFromStorage<T>({
  name,
  parse,
}: {
  name: string;
  parse: (input: string | void) => T | void;
}): T | void {
  return parse(ignoreError(() => localStorage.getItem(name)));
}

export default <T>({
  defaultValue,
  name,
  parse = (input: string | void) => input as unknown as T,
  postProcess = (input: T) => input,
  urlSearchParams = new URLSearchParams(window.location.search),
}: {
  defaultValue: T;
  name: string;
  parse?: (input: string | void) => T | void;
  postProcess?: (input: T) => T;
  urlSearchParams: URLSearchParams;
}): T => {
  const safeParse: typeof parse = (input) => ignoreError(() => parse(input));
  return postProcess(
    // Did the user provide one in the URL?
    getFromUrl<T>({ name, parse: safeParse, urlSearchParams }) ||
      // Did they play previously?
      getFromStorage<T>({ name, parse: safeParse }) ||
      // Return the default value.
      defaultValue
  );
};

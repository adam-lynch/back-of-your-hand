import ignoreError from "./ignoreError";

export default ({ name, title }: { name: string; title: string }) => {
  ignoreError(() => {
    // @ts-expect-error no types
    window.goatcounter.count({
      path: name,
      title,
      event: true,
    });
  });
};

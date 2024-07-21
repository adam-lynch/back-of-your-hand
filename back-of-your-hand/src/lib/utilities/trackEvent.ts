import ignoreError from "./ignoreError";

export default ({ name, title }: { name: string; title: string }) => {
  ignoreError(() => {
    // @ts-ignore
    window.goatcounter.count({
      path: name,
      title,
      event: true,
    });
  });
};

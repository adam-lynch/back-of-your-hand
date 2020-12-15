import ignoreError from "./ignoreError";

export default ({ name, title }) => {
  ignoreError(() => {
    // @ts-ignore
    window.goatcounter.count({
      path: name,
      title,
      event: true,
    });
  });
};

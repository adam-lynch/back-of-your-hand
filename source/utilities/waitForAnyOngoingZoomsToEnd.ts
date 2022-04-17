import { get } from "svelte/store";

import { isZooming } from "../store";

/*
  This isn't bad but it's not 100% reliable. Just test your use case a good bit
*/
export default async (): Promise<void> => {
  if (!get(isZooming)) {
    return;
  }

  await new Promise<void>((resolve) => {
    let unsubscribe: ReturnType<typeof isZooming.subscribe>;
    unsubscribe = isZooming.subscribe((value) => {
      if (value) {
        return;
      }
      const onDone = () => {
        if (!unsubscribe) {
          setTimeout(onDone);
          return;
        }
        unsubscribe();
        resolve();
      };
      onDone();
    });
  });
};

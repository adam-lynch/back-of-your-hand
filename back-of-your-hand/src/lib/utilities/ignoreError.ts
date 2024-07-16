import { dev } from "$app/environment";

export default <T>(callback: (...args: unknown[]) => T): T | void => {
  try {
    return callback();
  } catch (e) {
    // @ts-ignore
    if (dev) {
      console.error(e);
    }
  }
};

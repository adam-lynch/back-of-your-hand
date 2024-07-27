export default <T>(callback: (...args: unknown[]) => T): T | void => {
  try {
    return callback();
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error(e);
    }
  }
};
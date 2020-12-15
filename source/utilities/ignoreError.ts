export default <T>(callback: (...args: unknown[]) => T): T | void => {
  try {
    return callback();
  } catch (e) {
    // @ts-ignore
    if (!isProduction) {
      console.error(e);
    }
  }
};

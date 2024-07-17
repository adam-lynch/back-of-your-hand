export default <T>(
  items: T[],
  getRandomNumber: () => number = Math.random,
): T => {
  return items[Math.floor(getRandomNumber() * items.length)];
};

// Return a value between min and max
export default (input: number, min: number, max: number): number => {
  let result = input;
  const rangeDifference = max - min;
  while (result < min) {
    result += rangeDifference;
  }
  while (result > max) {
    result -= rangeDifference;
  }
  return result;
};

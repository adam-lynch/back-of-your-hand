import getRandomItem from "./getRandomItem";

export default () => {
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += getRandomItem("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
  }
  return result;
};

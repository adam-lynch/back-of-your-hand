export default (distance: number): string =>
  distance > 1000 ? "red" : distance > 300 ? "orange" : "green";

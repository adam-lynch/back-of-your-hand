export default (distance) =>
  distance > 1000 ? "red" : distance > 300 ? "orange" : "green";

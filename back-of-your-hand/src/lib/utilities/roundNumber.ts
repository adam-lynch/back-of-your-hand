export default (input: number, numberOfDecimalPlaces: number): number =>
  parseFloat(
    Math.round(parseFloat(input + "e+" + numberOfDecimalPlaces)) +
      "e-" +
      numberOfDecimalPlaces,
  );

import capNumber from "./capNumber";

// Return a value between -180 and 180
export default (input: number): number => capNumber(input, -180, 180);

import { Round } from "./types";

export default (total: number, round: Round): number => {
  return Math.round(total / round.questions.length);
};

import { TYPE_MATRIX } from "./typeMatrix.js";

export function calculateAdvantage(attackerTypes, defenderTypes) {

  let multiplier = 1;

  for (let a of attackerTypes) {
    for (let d of defenderTypes) {

      const mod =
        TYPE_MATRIX[a]?.[d] ?? 1;

      multiplier *= mod;
    }
  }

  return multiplier;
}

export function battleReport(p1, p2) {

  const p1Score =
    calculateAdvantage(p1.types, p2.types);

  const p2Score =
    calculateAdvantage(p2.types, p1.types);

  return {
    p1: p1.name,
    p2: p2.name,
    p1Score,
    p2Score,
    result:
      p1Score > p2Score
        ? `${p1.name} wins advantage`
        : p2Score > p1Score
        ? `${p2.name} wins advantage`
        : "Even matchup"
  };
}

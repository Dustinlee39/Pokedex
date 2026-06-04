import { TYPE_MATRIX } from "./typeMatrix.js";

export function battleReport(a, b) {

  const aScore = score(a, b);
  const bScore = score(b, a);

  return {
    a: a.name,
    b: b.name,
    aScore,
    bScore,
    result:
      aScore > bScore
        ? `${a.name} has advantage`
        : bScore > aScore
        ? `${b.name} has advantage`
        : "Even matchup"
  };
}

function score(attacker, defender) {

  let total = 1;

  for (let t of attacker.types) {
    for (let d of defender.types) {

      const mod =
        TYPE_MATRIX[t]?.[d] ?? 1;

      total *= mod;
    }
  }

  return total;
}

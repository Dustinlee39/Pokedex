import { typeEffectiveness } from "./types.js";

export function battleAdvice(attacker, defender) {

  const results = [];

  for (let atkType of attacker.types) {

    const score = typeEffectiveness(atkType, defender.types);

    results.push({
      type: atkType,
      multiplier: score
    });
  }

  const best = results.reduce((a, b) =>
    a.multiplier > b.multiplier ? a : b
  );

  return {
    attacker: attacker.name,
    defender: defender.name,
    bestType: best.type,
    multiplier: best.multiplier,
    verdict:
      best.multiplier > 1
        ? `${attacker.name} has advantage`
        : best.multiplier < 1
        ? `${defender.name} has advantage`
        : "Even matchup"
  };
}

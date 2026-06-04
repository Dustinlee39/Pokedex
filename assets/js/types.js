const chart = {
  fire:     { grass: 2, water: 0.5, fire: 0.5 },
  water:    { fire: 2, rock: 2, water: 0.5, grass: 0.5 },
  grass:    { water: 2, fire: 0.5, grass: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5 },
  rock:     { fire: 2, flying: 2, grass: 0.5 },
  ground:   { electric: 2, fire: 2, grass: 0.5 }
};

export function typeEffectiveness(attacker, defenderTypes) {
  let multiplier = 1;

  for (let def of defenderTypes) {
    const value = chart[attacker]?.[def] ?? 1;
    multiplier *= value;
  }

  return multiplier;
}

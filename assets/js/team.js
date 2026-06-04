import { typeEffectiveness } from "./types.js";

export function evaluateTeam(team) {

  const coverage = {};
  const weaknesses = {};

  for (let pokemon of team) {

    for (let type of pokemon.types) {

      coverage[type] = (coverage[type] || 0) + 1;
    }

    // simplistic weakness model (expand later)
    for (let type of pokemon.types) {

      if (type === "fire") weaknesses.water = (weaknesses.water || 0) + 1;
      if (type === "water") weaknesses.electric = (weaknesses.electric || 0) + 1;
      if (type === "grass") weaknesses.fire = (weaknesses.fire || 0) + 1;
    }
  }

  return {
    teamSize: team.length,
    coverage,
    weaknesses
  };
}

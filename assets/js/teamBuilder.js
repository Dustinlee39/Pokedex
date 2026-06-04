export const TEAM = [];

export function addToTeam(pokemon) {

  if (TEAM.length >= 6) return false;

  TEAM.push(pokemon);

  return TEAM;
}

export function removeFromTeam(name) {

  const i = TEAM.findIndex(p => p.name === name);

  if (i !== -1) TEAM.splice(i, 1);

  return TEAM;
}

export function getTeam() {
  return TEAM;
}

export function analyzeTeam() {

  const types = {};

  TEAM.forEach(p => {

    p.types.forEach(t => {

      types[t] = (types[t] || 0) + 1;
    });
  });

  return {
    size: TEAM.length,
    typeSpread: types
  };
}

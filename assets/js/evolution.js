const BASE = "https://pokeapi.co/api/v2";

export async function getEvolutionChain(speciesUrl) {
  const speciesRes = await fetch(speciesUrl);
  const species = await speciesRes.json();

  const evoRes = await fetch(species.evolution_chain.url);
  const evoData = await evoRes.json();

  return parseChain(evoData.chain);
}

function parseChain(chain) {
  const result = [];

  let current = chain;

  while (current) {
    result.push({
      name: current.species.name,
      evolves_to: current.evolves_to.map(e => e.species.name)
    });

    current = current.evolves_to[0];
  }

  return result;
}

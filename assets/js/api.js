const BASE = "https://pokeapi.co/api/v2";

export async function fetchPokemon(id) {
  const res = await fetch(`${BASE}/pokemon/${id}`);
  return res.json();
}

export async function fetchSpecies(id) {
  const res = await fetch(`${BASE}/pokemon-species/${id}`);
  return res.json();
}

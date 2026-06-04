export function narrate(pokemon) {

  const types = pokemon.types.join(" and ");

  const lines = [
    `${pokemon.name} is a fascinating Pokémon.`,
    `It belongs to the ${types} type category.`,
    `Its biological structure suggests adaptive combat behavior.`,
    `Further study is recommended for optimal battle deployment.`
  ];

  return lines.join(" ");
}

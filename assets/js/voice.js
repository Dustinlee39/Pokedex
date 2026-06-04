export function parseCommand(text, pokemonList, showPokemon) {

  text = text.toLowerCase();

  if (text.includes("show")) {

    const name = text.replace("show", "").trim();

    const match = pokemonList.find(p =>
      p.name === name
    );

    if (match) {
      showPokemon(match);
      return;
    }
  }

  if (text.includes("strong against")) {
    return "Use Battle Advisor mode";
  }

  if (text.includes("team")) {
    return "Opening Team Builder";
  }

  return "Command not recognized";
}

import { REGIONS } from "./regions.js";
import { getEvolutionChain } from "./evolution.js";
import { narrate } from "./narrator.js";

export const PokedexController = {

  state: {
    region: "kanto",
    cache: [],
    selected: null
  },

  setRegion(name, loaders) {
    if (!REGIONS[name]) return;

    this.state.region = name;

    if (loaders?.loadRegion) {
      loaders.loadRegion(name);
    }
  },

  selectPokemon(pokemon, ui) {
    this.state.selected = pokemon;

    if (ui?.showDetail) {
      ui.showDetail(pokemon);
    }

    if (ui?.speak) {
      ui.speak(pokemon.name);
    }
  },

  async getEvolutionText(pokemon) {
    try {
      const chain =
        await getEvolutionChain(pokemon.species.url);

      return chain.map(p => p.name).join(" → ");
    } catch {
      return "Unknown evolution chain";
    }
  },

  narratePokemon(pokemon, speakFn) {
    const text = narrate(pokemon);

    if (speakFn) speakFn(text);
  },

  voiceCommand(text, actions) {
    const t = text.toLowerCase();

    if (t.includes("kanto")) return this.setRegion("kanto", actions);
    if (t.includes("johto")) return this.setRegion("johto", actions);
    if (t.includes("hoenn")) return this.setRegion("hoenn", actions);
    if (t.includes("sinnoh")) return this.setRegion("sinnoh", actions);

    if (t.startsWith("show ")) {
      const name = t.replace("show ", "").trim();
      return actions.findByName?.(name);
    }

    if (t.includes("battle")) {
      return "battle_mode";
    }

    return null;
  }
};

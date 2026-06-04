
// =======================================
// POKÉDEX MAIN APP (Termux-safe build)
// =======================================

const POKEDEX = {
  pokemon: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || "[]"),
  caught: new Set(JSON.parse(localStorage.getItem('caught') || "[]")),
  seen: new Set(JSON.parse(localStorage.getItem('seen') || "[]")),
  shinies: new Set(JSON.parse(localStorage.getItem('shinies') || "[]")),
};

const COMPARE = {
  slot1: null,
  slot2: null,
  activeSlot: null
};

// ---------------- DOM ----------------
document.addEventListener("DOMContentLoaded", async () => {
  await loadPokemonData();
  renderPokemonGrid();
  setupUI();
});

// ---------------- DATA ----------------
async function loadPokemonData() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await res.json();

  POKEDEX.pokemon = await Promise.all(
    data.results.map(async (p) => {
      const r = await fetch(p.url);
      const d = await r.json();

      return {
        id: d.id,
        name: d.name,
        sprite: d.sprites.front_default,
        stats: d.stats,
        types: d.types.map(t => t.type.name),
        height: d.height,
        weight: d.weight
      };
    })
  );
}

// ---------------- GRID ----------------
function renderPokemonGrid(list = POKEDEX.pokemon) {
  const grid = document.getElementById("pokemon-grid");
  grid.innerHTML = "";

  list.forEach(poke => {
    const card = document.createElement("div");
    card.className = "poke-card";

    card.innerHTML = `
      <img src="${poke.sprite}" />
      <div>${poke.name}</div>
    `;

    card.addEventListener("click", () => {
      // SLOT 1
      if (COMPARE.activeSlot === 1) {
        COMPARE.slot1 = poke;
        document.getElementById("compare-slot-1").innerText = poke.name;
        COMPARE.activeSlot = null;
        return;
      }

      // SLOT 2
      if (COMPARE.activeSlot === 2) {
        COMPARE.slot2 = poke;
        document.getElementById("compare-slot-2").innerText = poke.name;
        COMPARE.activeSlot = null;
        return;
      }

      showDetail(poke);
    });

    grid.appendChild(card);
  });
}

// ---------------- DETAIL ----------------
function showDetail(poke) {
  const el = document.getElementById("detail-content");

  el.innerHTML = `
    <h2>${poke.name}</h2>
    <img src="${poke.sprite}" />

    <p>Height: ${poke.height}</p>
    <p>Weight: ${poke.weight}</p>

    <button onclick="speak('${poke.name}')">Speak</button>
  `;

  switchView("detail");
}

// ---------------- COMPARE ----------------
function runCompare() {
  if (!COMPARE.slot1 || !COMPARE.slot2) {
    alert("Select 2 Pokémon first");
    return;
  }

  const a = COMPARE.slot1;
  const b = COMPARE.slot2;

  const html = `
    <h3>${a.name} vs ${b.name}</h3>

    <p>HP: ${a.stats[0].base_stat} vs ${b.stats[0].base_stat}</p>
    <p>ATK: ${a.stats[1].base_stat} vs ${b.stats[1].base_stat}</p>
    <p>DEF: ${a.stats[2].base_stat} vs ${b.stats[2].base_stat}</p>
    <p>SPD: ${a.stats[5].base_stat} vs ${b.stats[5].base_stat}</p>
  `;

  document.getElementById("compare-results").innerHTML = html;
  document.getElementById("compare-results").classList.remove("hidden");
}

// ---------------- VOICE ----------------
function speak(text) {
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(text)
  );
}

// ---------------- UI ----------------
function setupUI() {

  document.getElementById("compare-slot-1")
    .addEventListener("click", () => {
      COMPARE.activeSlot = 1;
      alert("Select Pokémon for Slot 1");
    });

  document.getElementById("compare-slot-2")
    .addEventListener("click", () => {
      COMPARE.activeSlot = 2;
      alert("Select Pokémon for Slot 2");
    });

  document.getElementById("action-a")
    .addEventListener("click", runCompare);
}

// ---------------- VIEW SWITCH ----------------
function switchView(view) {
  document.querySelectorAll(".view")
    .forEach(v => v.classList.add("hidden"));

  document.getElementById("view-" + view)
    .classList.remove("hidden");
}

window.speak = speak;
window.switchView = switchView;


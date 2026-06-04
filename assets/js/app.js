
// =======================================
// POKÉDEX FIXED CORE (COMPARE UI FIX)
// =======================================

const POKEDEX = {
  pokemon: [],
};

const COMPARE = {
  slot1: null,
  slot2: null,
  activeSlot: null
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadPokemon();
  render();
  wireUI();
});

// ---------------- LOAD ----------------
async function loadPokemon() {
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
        stats: d.stats
      };
    })
  );
}

// ---------------- RENDER ----------------
function render() {
  const grid = document.getElementById("pokemon-grid");
  grid.innerHTML = "";

  POKEDEX.pokemon.forEach(p => {
    const card = document.createElement("div");
    card.className = "poke-card";

    card.innerHTML = `
      <img src="${p.sprite}">
      <div>${p.name}</div>
    `;

    card.onclick = () => {

      if (COMPARE.activeSlot === 1) {
        COMPARE.slot1 = p;
        document.getElementById("compare-slot-1").innerText = p.name;
        COMPARE.activeSlot = null;
        return;
      }

      if (COMPARE.activeSlot === 2) {
        COMPARE.slot2 = p;
        document.getElementById("compare-slot-2").innerText = p.name;
        COMPARE.activeSlot = null;
        return;
      }

      showDetail(p);
    };

    grid.appendChild(card);
  });
}

// ---------------- DETAIL ----------------
function showDetail(p) {
  document.getElementById("detail-content").innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.sprite}">
  `;

  switchView("detail");
}

// ---------------- COMPARE ----------------
function runCompare() {
  if (!COMPARE.slot1 || !COMPARE.slot2) {
    alert("Pick two Pokémon first");
    return;
  }

  const a = COMPARE.slot1;
  const b = COMPARE.slot2;

  document.getElementById("compare-results").innerHTML = `
    <h3>${a.name} vs ${b.name}</h3>
    <p>HP: ${a.stats[0].base_stat} vs ${b.stats[0].base_stat}</p>
    <p>ATK: ${a.stats[1].base_stat} vs ${b.stats[1].base_stat}</p>
    <p>DEF: ${a.stats[2].base_stat} vs ${b.stats[2].base_stat}</p>
  `;

  document.getElementById("compare-results").classList.remove("hidden");
}

// ---------------- UI ----------------
function wireUI() {

  const slot1 = document.getElementById("compare-slot-1");
  const slot2 = document.getElementById("compare-slot-2");

  if (slot1) {
    slot1.onclick = () => {
      COMPARE.activeSlot = 1;
      alert("Slot 1 active - pick a Pokémon");
    };
  }

  if (slot2) {
    slot2.onclick = () => {
      COMPARE.activeSlot = 2;
      alert("Slot 2 active - pick a Pokémon");
    };
  }

  const btn = document.getElementById("action-a");
  if (btn) {
    btn.onclick = runCompare;
  }

  const navCompare = document.querySelector('[data-view="compare"]');
  if (navCompare) {
    navCompare.onclick = () => switchView("compare");
  }
}

// ---------------- VIEW SWITCH ----------------
function switchView(v) {

  document.querySelectorAll(".view").forEach(el => {
    el.classList.add("hidden");
  });

  const target = document.getElementById("view-" + v);

  if (target) {
    target.classList.remove("hidden");
  }
}

window.switchView = switchView;


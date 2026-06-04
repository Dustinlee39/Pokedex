
const COMPARE = {
  slot1: null,
  slot2: null,
  activeSlot: null
};

let POKEDEX = [];

document.addEventListener("DOMContentLoaded", async () => {
  await load();
  render();
  wire();
});

async function load() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await res.json();

  POKEDEX = await Promise.all(
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

function render() {
  const grid = document.getElementById("pokemon-grid");
  if (!grid) return;

  grid.innerHTML = "";

  POKEDEX.forEach(p => {
    const card = document.createElement("div");
    card.innerHTML = p.name;

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
    };

    grid.appendChild(card);
  });
}

function wire() {

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.onclick = () => {
      switchView(btn.dataset.view);
    };
  });

  document.getElementById("compare-slot-1").onclick = () => {
    COMPARE.activeSlot = 1;
    alert("Pick Pokémon for Slot 1");
  };

  document.getElementById("compare-slot-2").onclick = () => {
    COMPARE.activeSlot = 2;
    alert("Pick Pokémon for Slot 2");
  };

  document.getElementById("action-a").onclick = runCompare;
}

function runCompare() {

  if (!COMPARE.slot1 || !COMPARE.slot2) {
    alert("Need 2 Pokémon");
    return;
  }

  const a = COMPARE.slot1;
  const b = COMPARE.slot2;

  document.getElementById("compare-results").innerHTML = `
    <h3>${a.name} vs ${b.name}</h3>
    <p>HP ${a.stats[0].base_stat} vs ${b.stats[0].base_stat}</p>
  `;
}

function switchView(v) {

  document.querySelectorAll(".view").forEach(x => {
    x.classList.add("hidden");
  });

  const el = document.getElementById("view-" + v);
  if (el) el.classList.remove("hidden");
}

window.switchView = switchView;


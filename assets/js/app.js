import { openDB, savePokemon, getPokemon } from "./db.js";
import { fetchPokemon } from "./api.js";
import { getEvolutionChain } from "./evolution.js";
import { REGIONS } from "./regions.js";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");

let db;
let cache = [];

async function init() {

  db = await openDB();

  loadRegion("kanto");

  setupVoice();
}

async function loadRegion(regionName) {

  const region = REGIONS[regionName];

  cache = [];
  grid.innerHTML = "";

  for (let i = region.start; i <= region.end; i++) {

    let p = await getPokemon(db, i);

    if (!p) {
      p = await fetchPokemon(i);
      p.id = i;
      savePokemon(db, p);
    }

    cache.push(p);
    render(p);
  }
}

function render(p) {

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${p.sprites.front_default}">
    <div>${p.name}</div>
  `;

  card.onclick = () => show(p);

  grid.appendChild(card);
}

async function show(p) {

  let evo = "";

  try {
    const chain =
      await getEvolutionChain(p.species.url);

    evo = chain.map(x => x.name).join(" → ");
  } catch {}

  detail.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.sprites.front_default}">
    <p><b>Evolution:</b> ${evo}</p>
  `;
}

/* Voice system placeholder */
function setupVoice() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const rec = new SpeechRecognition();
  rec.lang = "en-US";

  rec.onresult = (e) => {
    const text =
      e.results[0][0].transcript;

    console.log("VOICE:", text);
  };

  document.addEventListener("click", () => {
    rec.start();
  }, { once: true });
}

init();

import { openDB, getPokemon, savePokemon } from "./db.js";
import { fetchPokemon } from "./api.js";
import { REGIONS } from "./regions.js";
import { PokedexController } from "./controller.js";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");

let db;
let cache = [];

async function init() {
  db = await openDB();

  loadRegion("kanto");

  setupVoice();
}

/* REGION LOADER */
async function loadRegion(name) {

  const region = REGIONS[name];

  cache = [];
  grid.innerHTML = "";

  PokedexController.state.cache = cache;

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

/* RENDER */
function render(p) {

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${p.sprites.front_default}">
    <div>${p.name}</div>
  `;

  card.onclick = () =>
    PokedexController.selectPokemon(p, {
      showDetail,
      speak: speak
    });

  grid.appendChild(card);
}

/* DETAIL VIEW */
async function showDetail(p) {

  const evo =
    await PokedexController.getEvolutionText(p);

  detail.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.sprites.front_default}">
    <p>${evo}</p>

    <button onclick="narratePokemon('${p.name}')">
      Narrate
    </button>
  `;
}

/* VOICE */
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

    const result =
      PokedexController.voiceCommand(text, {
        loadRegion,
        findByName: (name) =>
          cache.find(p => p.name === name)
      });

    if (result && typeof result === "object") {
      PokedexController.selectPokemon(result, {
        showDetail,
        speak
      });
    }
  };

  document.addEventListener("click", () => {
    rec.start();
  }, { once: true });
}

/* SPEECH */
function speak(text) {
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(text)
  );
}

window.narratePokemon = function(name) {

  const p =
    cache.find(x => x.name === name);

  if (!p) return;

  PokedexController.narratePokemon(p, speak);
};

init();

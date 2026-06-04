import { openDB, savePokemon, getPokemon } from "./db.js";
import { fetchPokemon } from "./api.js";
import { getEvolutionChain } from "./evolution.js";
import { REGIONS } from "./regions.js";
import { commandRouter } from "./router.js";
import { initRegions } from "./ui_regions.js";
import { initBattleUI, setBattleSelection } from "./ui_battle.js";
import { renderTeamUI, renderTeamList } from "./ui_team.js";
import { narrate } from "./narrator.js";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");

let db;
let cache = [];

async function init() {

  db = await openDB();

  initRegions(loadRegion);

  initBattleUI("detail");

  loadRegion("kanto");

  setupVoice();
}

/* REGION LOADER */
async function loadRegion(name) {

  const region = REGIONS[name];

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

/* CARD */
function render(p) {

  const card = document.createElement("div");

  card.className = "card";

  card.innerHTML = `
    <img src="${p.sprites.front_default}">
    <div>${p.name}</div>
  `;

  card.onclick = () => {
    show(p);
    setBattleSelection(p);
  };

  grid.appendChild(card);
}

/* DETAIL VIEW */
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
    <p>${evo}</p>

    <button onclick="speak('${p.name}')">
      Speak
    </button>

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

    const cmd =
      commandRouter(text, { cache });

    handle(cmd);
  };

  document.addEventListener("click", () => {
    rec.start();
  }, { once: true });
}

/* COMMAND HANDLER */
function handle(cmd) {

  if (typeof cmd === "string") {

    if (REGIONS[cmd]) loadRegion(cmd);
  }

  if (cmd?.action === "show") {
    if (cmd.data) show(cmd.data);
  }
}

/* GLOBAL FUNCTIONS */
window.speak = function(text) {
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(text)
  );
};

window.narratePokemon = function(name) {

  const p =
    cache.find(x => x.name === name);

  if (!p) return;

  const text = narrate(p);

  speechSynthesis.speak(
    new SpeechSynthesisUtterance(text)
  );
};

init();

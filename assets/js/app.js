import { openDB, savePokemon, getPokemon } from "./db.js";
import { fetchPokemon } from "./api.js";
import { getEvolutionChain } from "./evolution.js";
import { REGIONS } from "./regions.js";
import { commandRouter } from "./router.js";
import { initRegions } from "./ui_regions.js";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");

let db;
let cache = [];

async function init() {

  db = await openDB();

  initRegions(loadRegion);

  loadRegion("kanto");

  setupVoice();
}

/* REGION LOADER */
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

/* UI RENDER */
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
    <p><b>Evolution:</b> ${evo}</p>

    <button onclick="speak('${p.name}')">
      Speak
    </button>
  `;
}

/* VOICE + COMMAND ROUTER */
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
      commandRouter(text, { cache });

    handleCommand(result);
  };

  document.addEventListener("click", () => {
    rec.start();
  }, { once: true });
}

/* COMMAND EXECUTOR */
function handleCommand(cmd) {

  if (cmd === "kanto" ||
      cmd === "johto" ||
      cmd === "hoenn" ||
      cmd === "sinnoh") {

    loadRegion(cmd);
  }

  if (cmd?.action === "show") {
    if (cmd.data) show(cmd.data);
  }

  console.log("CMD:", cmd);
}

/* GLOBAL SPEECH */
window.speak = function(text) {
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(text)
  );
};

init();

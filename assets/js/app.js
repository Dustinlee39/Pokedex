import { openDB, savePokemon, getPokemon } from "./db.js";
import { fetchPokemon } from "./api.js";
import { getEvolutionChain } from "./evolution.js";
import { parseCommand } from "./voice.js";
import { battleAdvice } from "./battle.js";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");

let db;
let cache = [];

async function init() {

  db = await openDB();

  await load();

  setupVoice();
}

async function load() {

  for (let i = 1; i <= 151; i++) {

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

  let evoText = "";

  try {
    const evo = await getEvolutionChain(p.species.url);
    evoText = evo.map(e => e.name).join(" → ");
  } catch {}

  detail.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.sprites.front_default}">
    <p><b>Evolution:</b> ${evoText}</p>

    <button onclick="speak('${p.name}')">Speak</button>
  `;
}

/* ---------------- VOICE ---------------- */

function setupVoice() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const rec = new SpeechRecognition();

  rec.continuous = false;
  rec.lang = "en-US";

  rec.onresult = (e) => {

    const text = e.results[0][0].transcript;

    const result = parseCommand(
      text,
      cache,
      show
    );

    console.log(result);
  };

  document.addEventListener("click", () => {
    rec.start();
  }, { once: true });
}

window.speak = function(text) {
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(text)
  );
};

init();

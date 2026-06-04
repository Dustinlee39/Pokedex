import { openDB, savePokemon, getPokemon } from "./db.js";
import { fetchPokemon } from "./api.js";
import { getEvolutionChain } from "./evolution.js";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");

let db;

async function init() {
  db = await openDB();
  load();
}

async function load() {
  for (let i = 1; i <= 151; i++) {

    let p = await getPokemon(db, i);

    if (!p) {
      p = await fetchPokemon(i);
      p.id = i;
      savePokemon(db, p);
    }

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

  let evoText = "Loading evolution...";

  try {
    const evo = await getEvolutionChain(p.species.url);

    evoText = evo.map(e => e.name).join(" → ");
  } catch (e) {
    evoText = "No evolution data";
  }

  detail.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.sprites.front_default}">

    <p><b>Height:</b> ${p.height}</p>
    <p><b>Weight:</b> ${p.weight}</p>

    <p><b>Evolution:</b> ${evoText}</p>

    <button onclick="speak('${p.name}')">Speak</button>
  `;
}

function speak(text) {
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(text)
  );
}

init();

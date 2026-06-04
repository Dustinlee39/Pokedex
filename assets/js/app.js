import { openDB, savePokemon, getPokemon } from "./db.js";
import { fetchPokemon } from "./api.js";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");

let db;

async function init() {
  db = await openDB();
  load();
}

async function load() {
  for (let i = 1; i <= 151; i++) {

    let pokemon = await getPokemon(db, i);

    if (!pokemon) {
      pokemon = await fetchPokemon(i);
      pokemon.id = i;
      savePokemon(db, pokemon);
    }

    renderCard(pokemon);
  }
}

function renderCard(p) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${p.sprites.front_default}">
    <div>${p.name}</div>
  `;

  card.onclick = () => show(p);
  grid.appendChild(card);
}

function show(p) {
  detail.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.sprites.front_default}">
    <p>Height: ${p.height}</p>
    <p>Weight: ${p.weight}</p>
    <button onclick="speak('${p.name}')">Speak</button>
  `;
}

function speak(text) {
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(text)
  );
}

init();

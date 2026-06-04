const grid = document.getElementById("grid");
const detail = document.getElementById("detail");

let cache = [];

async function load() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await res.json();
  cache = data.results;
  render();
}

async function render() {
  grid.innerHTML = "";

  for (let p of cache) {
    const res = await fetch(p.url);
    const d = await res.json();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${d.sprites.front_default}">
      <div>${d.name}</div>
    `;

    card.onclick = () => show(d);
    grid.appendChild(card);
  }
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
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}

load();

// register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}

import { battleReport } from "./battle.js";

let selected = [];

export function initBattleUI(containerId) {

  const container =
    document.getElementById(containerId);

  const ui = document.createElement("div");

  ui.innerHTML = `
    <h3>Battle Simulator</h3>
    <div id="battle-a">Select Pokémon A</div>
    <div id="battle-b">Select Pokémon B</div>
    <button id="fight">SIMULATE</button>
    <div id="result"></div>
  `;

  container.appendChild(ui);

  document.getElementById("fight").onclick =
    () => runBattle();
}

export function setBattleSelection(pokemon) {

  if (selected.length >= 2) {
    selected = [];
  }

  selected.push(pokemon);
}

function runBattle() {

  if (selected.length < 2) return;

  const result =
    battleReport(selected[0], selected[1]);

  document.getElementById("result").innerText =
    result.result;
}

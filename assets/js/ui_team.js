import { analyzeTeam, getTeam } from "./teamBuilder.js";

export function renderTeamUI(containerId) {

  const container =
    document.getElementById(containerId);

  const data = analyzeTeam();

  container.innerHTML = `
    <h3>Team Analysis</h3>
    <p>Size: ${data.size}/6</p>
    <pre>${JSON.stringify(data.typeSpread, null, 2)}</pre>
  `;
}

export function renderTeamList(containerId) {

  const container =
    document.getElementById(containerId);

  container.innerHTML = "";

  getTeam().forEach(p => {

    const el = document.createElement("div");

    el.innerText = p.name;

    container.appendChild(el);
  });
}

import { REGIONS } from "./regions.js";

export function initRegions(onSelect) {

  const container = document.createElement("div");

  container.id = "regions";

  Object.keys(REGIONS).forEach(name => {

    const btn = document.createElement("button");

    btn.textContent = name.toUpperCase();

    btn.onclick = () => onSelect(name);

    container.appendChild(btn);
  });

  document.body.prepend(container);
}

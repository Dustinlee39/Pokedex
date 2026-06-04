export const REGIONS = {
  kanto: { start: 1, end: 151 },
  johto: { start: 152, end: 251 },
  hoenn: { start: 252, end: 386 },
  sinnoh: { start: 387, end: 493 }
};

export function getRegion(name) {
  return REGIONS[name];
}

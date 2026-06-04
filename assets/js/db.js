const DB_NAME = "pokedex";
const STORE = "pokemon";

export function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id" });
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePokemon(db, pokemon) {
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(pokemon);
}

export async function getPokemon(db, id) {
  return new Promise(res => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => res(req.result);
  });
}

import type { Pokemon, Question } from "./logic";
import { PUBLIC_BASE_PATH } from '$env/static/public'; 

export async function loadData(): Promise<{ pokemons: Pokemon[], questions: Question[] }> {

    const basePath = PUBLIC_BASE_PATH || '';
    const dataPath = `${basePath}/pokemons.json`;

  const res = await fetch(dataPath);
  if (!res.ok) throw new Error("Impossible de charger pokemons.json");
  return res.json();
}

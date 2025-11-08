import type { Pokemon, Question } from "./logic";

export async function loadData(): Promise<{ pokemons: Pokemon[], questions: Question[] }> {
  const res = await fetch('/pokemons.json');
  if (!res.ok) throw new Error("Impossible de charger pokemons.json");
  return res.json();
}

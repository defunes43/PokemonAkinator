import { TextToSpeech } from '@capacitor-community/text-to-speech'; 

export type Answer = 'yes' | 'no' | 'unknown';

export interface Pokemon {
  name: string;
  traits: Record<string, boolean | null>;
  color: string;
  sprite: string;
}

export interface Question {
  key: string;
  label: string;
}

export interface AskedQuestion extends Question {
    removedPokemon: Pokemon[]
}

export function entropy(subsets: Pokemon[][]): number {
  const total = subsets.reduce((sum, s) => sum + s.length, 0);
  let h = 0;
  for (const s of subsets) {
    if (s.length === 0) continue;
    const p = s.length / total;
    h -= p * Math.log2(p);
  }
  return h;
}

export function informationGain(pokemons: Pokemon[], question: Question): number {
  const yesSet = pokemons.filter(p => p.traits[question.key] === true);
  const noSet = pokemons.filter(p => p.traits[question.key] === false);
  const unknownSet = pokemons.filter(p => p.traits[question.key] === null);

  return entropy([pokemons]) - entropy([yesSet, noSet, unknownSet]);
}

export function bestQuestionRandomized(pokemons: Pokemon[], questions: Question[], randomness = 0.1): Question | null {
  const scored = questions.map(q => {
    const ig = informationGain(pokemons, q);
    const noise = 1;//1 + (Math.random() - 0.5) * randomness * 2;
    return { question: q, ig: ig * noise };
  });
  console.log(scored);
  scored.sort((a, b) => a.ig - b.ig);
  const top = scored.slice(0, 3);
  if (top.length === 0) return null;
  return top[Math.floor(Math.random() * top.length)].question;
}

export async function speak(text: string) {
    
  const correctedText = text.replace(/Pokémon/g, 'Poquémmone').replace(/pokémon/g, 'Poquémmone');

   await TextToSpeech.speak({
            text: correctedText,
            lang: 'fr-FR',
            rate: 1.0,
            volume: 1.0
        });
}

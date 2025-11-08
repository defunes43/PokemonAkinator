<script lang="ts">
import { onMount } from 'svelte';
import { loadData } from '$lib/dataLoader';
import { bestQuestionRandomized, speak} from '$lib/logic';
import type { AskedQuestion, Pokemon, Question } from '$lib/logic';
import 'knopf.css';

let pokemonsRestants: Pokemon[] = [];
let askedQuestions: AskedQuestion[] = [];
let availableQuestions: Question[] = [];
let currentQuestion: Question | null = null;
let currentPokemon: Pokemon | null = null;
let result = '';

onMount(async () => {
  const data = await loadData();
  pokemonsRestants = data.pokemons;
  availableQuestions = [...data.questions];
  nextQuestion();
});

function answer(ans: 'yes' | 'no' | 'unknown') {
  if (!currentQuestion) return;

    const { remaining, removed } = pokemonsRestants.reduce(
  (acc, p) => {
    const val = p.traits[currentQuestion!.key];
    const keep =
      ans === "yes" ? val === true :
      ans === "no" ? val === false :
      true;

    if (keep) acc.remaining.push(p);
    else acc.removed.push(p);

    return acc;
  },
  { remaining: [] as Pokemon[], removed: [] as Pokemon[] }
);

  pokemonsRestants = remaining;

  const askedQuestion: AskedQuestion = {
    ...currentQuestion,
    removedPokemon: removed
  }

  askedQuestions = [...askedQuestions, askedQuestion];
  availableQuestions = availableQuestions.filter(q => q.key !== currentQuestion!.key);
  nextQuestion();
  console.log(askedQuestions);
}

function cancelAnswer(question: AskedQuestion){
    askedQuestions = askedQuestions.filter (q => q.key !== question.key);
    pokemonsRestants = [...pokemonsRestants, ...question.removedPokemon];
    availableQuestions = [...availableQuestions, question];
    nextQuestion();
}

function nextQuestion() {
  if (pokemonsRestants.length === 1) {
    result = `Je pense que ton Pokémon est ${pokemonsRestants[0].name} !`;
    currentQuestion = null;
    speak(result);
    return;
  }
  if (availableQuestions.length === 0) {
    result = "Je ne suis pas sûr...";
    currentQuestion = null;
    speak(result);
    return;
  }
  currentQuestion = bestQuestionRandomized(pokemonsRestants, availableQuestions);
  if (currentQuestion) speak(currentQuestion.label);
}
</script>

<main>
  <h1>Pokémon Akinator</h1>
  {#if currentQuestion}
    <p>{currentQuestion.label}</p> <button on:click={() => {if (currentQuestion) speak(currentQuestion.label)}} class="knopf btn-round btn-reecouter">🔊 Réécouter</button>
    <button class="knopf btn-round btn-oui" on:click={() => answer('yes')}>✔ Oui</button>
    <button class="knopf btn-round btn-non" on:click={() => answer('no')}>❌ Non</button>
  {/if}

  {#if result}
    <h2>{result}</h2>
  {/if}

  <h3>Pokémons restants :</h3>
  <ul>
    {#each pokemonsRestants as p} 
        <img style="background-color: {p.color}" src={p.sprite} alt={p.name}/>
    {/each}
  </ul>

<h3>Questions déjà posées :</h3>
<ul>
  {#each askedQuestions as q}
    <li>
      {q.label} <button class="knopf btn-round btn-non" on:click={() => cancelAnswer(q)}>❌ Annuler</button>
      {#if q.removedPokemon.length > 0}
        <!-- Les Pokémon retirés affichés en ligne -->
        <div class="removed-pokemons">
          {#each q.removedPokemon as p}
            <img src={p.sprite} alt={p.name} title={p.name} style="border: 2px solid {p.color}; margin: 2px; width: 40px; height: 40px;" />
          {/each}
        </div>
      {/if}
    </li>
  {/each}
</ul>
</main>

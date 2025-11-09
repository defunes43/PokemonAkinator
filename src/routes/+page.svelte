<script lang="ts">

import { onMount } from 'svelte';
import { loadData } from '$lib/dataLoader';
import { bestQuestionRandomized, speak} from '$lib/logic';
import type { AskedQuestion, Pokemon, Question } from '$lib/logic';
import 'knopf.css';

  import { collection } from '$lib/stores/collection';
  import { fly } from 'svelte/transition';
  import { tick } from 'svelte';

  let showPokeball = false;

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
      // Logique pour filtrer en fonction de la réponse
      const keep =
        ans === "yes" ? val === true :
        ans === "no" ? val === false :
        // Pour 'unknown', nous gardons tous les Pokémons pour l'instant (la logique actuelle ne traite pas un trait 'undefined' ou 'null')
        // Dans un système complet, 'unknown' pourrait signifier garder les Pokémons pour lesquels le trait n'est pas défini.
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

async function nextQuestion() {
  if (pokemonsRestants.length === 1) {

    showPokeball = true;
    result = `Je pense que ton Pokémon est ${pokemonsRestants[0].name} !`;
    currentQuestion = null;

    collection.add(pokemonsRestants[0].name);
    
    await tick();
    setTimeout(() => (showPokeball = false), 1500);

    speak(result);
    return;
  }
  if (availableQuestions.length === 0 || pokemonsRestants.length === 0) {
    // Ajout de pokemonsRestants.length === 0 au cas où l'utilisateur se trompe
    result = "Je ne suis pas sûr... Il ne reste plus d'options.";
    currentQuestion = null;
    speak(result);
    return;
  }

  currentQuestion = bestQuestionRandomized(pokemonsRestants, availableQuestions);
  if (currentQuestion) speak(currentQuestion.label);
}
</script>

<main class="akinator-container">
  <header>
    <h1><span aria-hidden="true">🧠</span> Pokémon Akinator</h1>
  </header>

  <section class="game-section">
    {#if currentQuestion}
      <div class="question-area">
        <p class="current-question-label">{currentQuestion.label}</p>
        <button on:click={() => {if (currentQuestion) speak(currentQuestion.label)}} class="knopf btn-round btn-reecouter">
          <span aria-hidden="true">🔊</span> Réécouter
        </button>
      </div>

      <div class="answer-buttons">
        <button class="knopf btn-round btn-inconnu" on:click={() => answer('unknown')}>❓ Je ne sais pas</button>
        <button class="knopf btn-round btn-non" on:click={() => answer('no')}>❌ Non</button>
        <button class="knopf btn-round btn-oui" on:click={() => answer('yes')}>✔ Oui</button>
      </div>
    {:else if result}
      <h2 class="result-message">{result}</h2>
      <button class="knopf btn-round btn-reset" on:click={() => window.location.reload()}>
        <span aria-hidden="true">🔄</span> Recommencer
      </button>
    {/if}
  </section>

  <hr>

  <div class="status-sections">
    <section class="remaining-pokemons-section">
      <h3><span aria-hidden="true">👀</span> Pokémons restants ({pokemonsRestants.length}) :</h3>
      <ul class="pokemon-list">
        {#each pokemonsRestants as p}
          <li class="pokemon-item" style="--p-color: {p.color};">
            <img src={p.sprite} alt={p.name} title={p.name} class="pokemon-sprite" />
          </li>
        {/each}
      </ul>
    </section>

    <section class="asked-questions-section">
      <h3><span aria-hidden="true">📜</span> Questions déjà posées :</h3>
      <ul class="asked-questions-list">
        {#each askedQuestions.slice().reverse() as q} <li class="asked-question-item">
            <p>{q.label}</p>
            <div class="question-actions">
              <button class="knopf btn-round btn-cancel" on:click={() => cancelAnswer(q)}>
                <span aria-hidden="true">↩️</span> Annuler
              </button>
            </div>
            
            {#if q.removedPokemon.length > 0}
              <div class="removed-pokemons">
                <span class="removed-label">Retirés :</span>
                <div class="removed-sprites-container">
                  {#each q.removedPokemon as p}
                    <img src={p.sprite} alt={p.name} title={p.name} class="removed-sprite" style="--p-color: {p.color};" />
                  {/each}
                </div>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  </div>

  {#if showPokeball}
  <div class="pokeball-animation" transition:fly={{ y: 200, duration: 1200 }}>
    <img src="/pokeball.png" alt="Pokéball" />
  </div>
{/if}

</main>

<style>
  /* Variables pour la cohérence des couleurs/tailles */
  :root {
    --color-primary: #3498db;
    --color-success: #2ecc71;
    --color-danger: #e74c3c;
    --color-warning: #f1c40f;
    --color-background: #ecf0f1;
    --color-text: #2c3e50;
    --spacing-s: 10px;
    --spacing-m: 20px;
    --border-radius: 12px;
  }

  .akinator-container {
    padding: var(--spacing-m);
    max-width: 1000px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--color-text);
  }

  /* --- Header et Titre --- */
  header {
    text-align: center;
    margin-bottom: var(--spacing-m);
  }

  h1 {
    font-size: 2.5rem;
    color: var(--color-primary);
    font-weight: 700;
  }
  
  h3 {
    font-size: 1.3rem;
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: var(--spacing-s);
    margin-top: var(--spacing-m);
  }

  /* --- Section de Jeu (Question et Boutons) --- */
  .game-section {
    background-color: white;
    padding: var(--spacing-m);
    border-radius: var(--border-radius);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .question-area {
    margin-bottom: var(--spacing-m);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-s);
  }

  .current-question-label {
    font-size: 1.8rem;
    font-weight: 500;
    color: var(--color-text);
    margin: 0;
  }

  .result-message {
    font-size: 2rem;
    color: var(--color-danger);
    margin-bottom: var(--spacing-m);
  }
  
  /* Boutons de Réponse (Optimisation Tablette : centré et plus grand) */
  .answer-buttons {
    display: flex;
    flex-direction: column; /* Par défaut: stacké pour mobile */
    gap: var(--spacing-s);
  }

  @media (min-width: 600px) {
    .answer-buttons {
      flex-direction: row; /* Tablette: aligné horizontalement */
      justify-content: center;
    }
  }

  /* Style des boutons (définis dans le layout, mais on peut les customiser ici) */
  .knopf {
    padding: 1.2em 2em !important; /* Augmenter la zone de clic pour les tablettes */
    font-size: 1.1rem !important;
    min-width: 150px; /* Assurer une taille minimale */
  }

  /* --- Sections Status (Pokémons et Questions) --- */
  .status-sections {
    display: grid;
    gap: var(--spacing-m);
  }

  @media (min-width: 768px) {
    .status-sections {
      /* Deux colonnes sur tablette/desktop */
      grid-template-columns: 1fr 1fr; 
    }
  }

  /* --- Liste des Pokémons Restants --- */
  .pokemon-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-s);
    justify-content: center;
  }

  .pokemon-item {
    position: relative;
    padding: var(--spacing-s);
    border: 3px solid var(--p-color, #ccc); /* Utilisation de la variable CSS locale */
    border-radius: var(--border-radius);
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }

  .pokemon-sprite {
    width: 60px;
    height: 60px;
    display: block;
  }

  /* --- Liste des Questions Posées --- */
  .asked-questions-list {
    list-style: none;
    padding: 0;
  }

  .asked-question-item {
    background-color: white;
    padding: var(--spacing-s);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-s);
    border-left: 5px solid var(--color-primary);
  }

  .asked-question-item p {
    margin: 0 0 var(--spacing-s) 0;
    font-weight: 600;
  }

  .question-actions {
    margin-bottom: var(--spacing-s);
  }
  
  /* Pokémons retirés */
  .removed-pokemons {
    margin-top: var(--spacing-s);
    padding-top: var(--spacing-s);
    border-top: 1px dashed #ccc;
  }

  .removed-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-danger);
    margin-right: var(--spacing-s);
    display: block;
  }

  .removed-sprites-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .removed-sprite {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 2px solid var(--p-color, #ccc);
    object-fit: contain;
  }

  .pokeball-animation {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  animation: bounce 1.2s ease-in-out;
}

.pokeball-animation img {
  width: 80px;
  height: 80px;
}

@keyframes bounce {
  0% { transform: translate(-50%, -400px); }
  50% { transform: translate(-50%, 0); }
  70% { transform: translate(-50%, -30px); }
  100% { transform: translate(-50%, 0); }
}
</style>
<script lang="ts">
  import { onMount } from 'svelte';
  import { loadData } from '$lib/dataLoader';
  import { collection } from '$lib/stores/collection';
  import { get } from 'svelte/store';
  import type { Pokemon } from '$lib/logic';

import { PUBLIC_BASE_PATH } from '$env/static/public';
    const basePath = PUBLIC_BASE_PATH || '';

  let pokemons: Pokemon[] = [];
  let owned: string[] = [];

  onMount(async () => {
    const data = await loadData();
    pokemons = data.pokemons;
    owned = get(collection);
  });
</script>

<main class="collection-container">
  <header>
    <h1>📘 Ma Collection Pokémon</h1>
  </header>

  <section class="collection-grid">
    {#each pokemons as p}
      <div class="pokemon-card">
        <img src={p.sprite} alt={p.name} class="pokemon-sprite" />
        <p class="pokemon-name">{p.name}</p>
        {#if owned.includes(p.name)}
          <img src="${basePath}/pokeball.png" alt="Pokéball" class="pokeball-overlay" />
        {/if}
      </div>
    {/each}
  </section>
</main>

<style>
  .collection-container {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .collection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 15px;
  }

  .pokemon-card {
    position: relative;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    padding: 10px;
  }

  .pokemon-sprite {
    width: 80px;
    height: 80px;
  }

  .pokemon-name {
    font-size: 0.9rem;
    margin-top: 5px;
  }

  .pokeball-overlay {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 40px;
    opacity: 0.6;
  }
</style>

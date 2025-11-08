<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<style>
  /* Boutons ronds avec icônes */
  .btn-round {
    border-radius: 50px;
    padding: 0.6em 1.5em;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    font-weight: 600;
  }
  .btn-oui {
    background-color: #28a745;
    color: white;
    border: none;
  }
  .btn-non {
    background-color: #dc3545;
    color: white;
    border: none;
  }
  .btn-reecouter {
    background-color: #007bff;
    color: white;
    border: none;
  }

    .color-square {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    border: 1px solid #000;
    display: none;
  }
</style>

{@render children()}

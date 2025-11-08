<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>

<style>
    /* Reset et Base */
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #ecf0f1; /* Fond gris clair moderne */
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
    }

    /* --- Boutons Ronds Améliorés (Global) --- */
    .btn-round {
        border-radius: 50px;
        padding: 0.8em 1.8em; /* Plus grand pour le tactile */
        font-size: 1.1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        cursor: pointer;
        font-weight: 700;
        transition: background-color 0.2s, transform 0.1s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre légère pour effet 3D */
    }

    .btn-round:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    
    .btn-round:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Couleurs Modernes */
    .btn-oui {
        background-color: #2ecc71; /* Vert Succès (Flat UI) */
        color: white;
        border: none;
    }
    .btn-non {
        background-color: #e74c3c; /* Rouge Alerte (Flat UI) */
        color: white;
        border: none;
    }
    .btn-inconnu {
        background-color: #f1c40f; /* Jaune/Orange Avertissement */
        color: #333;
        border: none;
    }
    .btn-reecouter, .btn-cancel {
        background-color: #3498db; /* Bleu Primaire */
        color: white;
        border: none;
    }
    .btn-reset {
        background-color: #95a5a6; /* Gris pour reset/neutre */
        color: white;
        border: none;
    }

    /* Le reste du style original (si nécessaire) */
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
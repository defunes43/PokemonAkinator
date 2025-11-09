<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
    let { children } = $props();
    import {page} from '$app/stores';
    import { base } from '$app/paths';

const navItems = $derived([
 { 
href: '/', 
label: 'Accueil', 
icon: "<i class='fa-solid fa-house'></i>",
 },
 { 
href: '/collection', 
label: 'Collection', 
 icon: "<i class='fa-solid fa-folder'></i>",
 }
]);


const basePath = $derived(base);

    const currentPath = $derived($page.url.pathname);

     const getIsActive = (path: string) => {

        const targetPath = (path === '/') ? basePath : `${basePath}${path}`;
        

        if (currentPath === targetPath) {
            return true;
        }

        if (path !== '/' && currentPath.startsWith(targetPath)) {
            return true;
        }

        return false;
    };
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" xintegrity="sha512-SnH5WK+bZxgPHs44uWIX+LLMD/CDQeI9WwSFPK+hF/h9uQpQ5/3r0t5/9NqW2S3P1A/A0t+E5Q0xJ6v1O2K8D9g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</svelte:head>

<style>
/* Reset et Base */
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #ecf0f1;
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
    }

    /* --- Boutons Ronds Améliorés (Global) --- */
    /* Les classes de boutons doivent être globales pour les composants enfants */
    :global(.btn-round) {
        border-radius: 50px;
        padding: 0.8em 1.8em;
        font-size: 1.1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        cursor: pointer;
        font-weight: 700;
        transition: background-color 0.2s, transform 0.1s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    :global(.btn-round:hover) {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    
    :global(.btn-round:active) {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Couleurs Modernes */
    :global(.btn-oui) {
        background-color: #2ecc71;
        color: white;
        border: none;
    }
    :global(.btn-non) {
        background-color: #e74c3c;
        color: white;
        border: none;
    }
    :global(.btn-inconnu) {
        background-color: #f1c40f;
        color: #333;
        border: none;
    }
    :global(.btn-reecouter), :global(.btn-cancel) {
        background-color: #3498db;
        color: white;
        border: none;
    }
    :global(.btn-reset) {
        background-color: #95a5a6;
        color: white;
        border: none;
    }

    /* Le conteneur principal doit avoir un padding équivalent à la hauteur de la nav bar */
    main {
        padding-bottom: 72px; 
        min-height: 100vh;
    }


    /* --- Styles Material Bottom Navigation --- */

    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        
        background-color: #ffffff; 
        border-top: none; 
        box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1); 
        height: 56px; 
        padding: 8px 0; 
        z-index: 1000;
    }
    
    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        text-decoration: none;
        
        color: #757575; 
        flex: 1; 
        min-width: 80px; 
        
        padding: 4px;
        margin: 0 4px; 
        
        transition: color 0.2s;
    }

    .nav-item .nav-icon {
        font-size: 18px; 
        margin-bottom: 4px; 
    }
    
    .nav-item .nav-label {
        font-size: 12px; 
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .nav-item.active {
        color: #3f51b5; 
    }
</style>

{@render children()}

<nav class="bottom-nav">
    {#each navItems as item}
        <!-- Construction du chemin complet : SvelteKit gère l'ajout du "base" si on part d'une racine (/) -->
        {@const href = (item.href === '/') ? basePath : `${basePath}${item.href}`}
        
        <a 
            {href} 
            class="nav-item"
            class:active={getIsActive(item.href)}
        >
            <!-- Utilisation de {@html ...} pour rendre l'icône comme du HTML -->
            <span class="nav-icon">{@html item.icon}</span>
            <span class="nav-label">{item.label}</span>
        </a>
    {/each}
</nav>
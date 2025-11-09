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
 match: (path: string, base: string) => path === base
 },
 { 
href: '/collection', 
label: 'Collection', 
 icon: "<i class='fa-solid fa-folder'></i>",
match: (path: string, base: string) => path.startsWith(`${base}/collection`)
 }
]);


const basePath = typeof window !== 'undefined' ? (window as any).PUBLIC_BASE_PATH || '' : '';

const currentPath = $derived($page.url.pathname.replace(basePath, ''));
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

 /* Reset et Base */
:global(body) {
margin: 0;
padding: 0;
background-color: #ecf0f1;
font-family: 'Roboto', sans-serif;
line-height: 1.6;
}
    
    /* Le conteneur principal doit avoir un padding équivalent à la hauteur de la nav bar */
    /* La barre de navigation fait environ 56px de haut + padding */
    main {
        padding-bottom: 72px; /* Assurez-vous que le contenu ne soit jamais caché */
        min-height: 100vh; /* Pour s'assurer que le padding fonctionne même sur du contenu court */
    }

.bottom-nav {
position: fixed;
 bottom: 0;
left: 0;
 right: 0;
display: flex;
 justify-content: space-around;

 background-color: #ffffff; /* Fond blanc pur Material */
 border-top: none; /* Retirer la bordure, l'ombre prend le relais */
box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1); /* Ombre (Elevation Lvl 8) CLÉ de Material Design */
height: 56px; /* Hauteur standard Material */
 padding: 8px 0; /* Padding vertical réduit pour centrer les éléments */
 z-index: 1000;
}
    
    .nav-item {
        /* Élément de navigation unique */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        text-decoration: none;
        
        color: #757575; /* Couleur neutre pour les icônes inactives (Material Gray 600) */
        flex: 1; 
        min-width: 80px; /* Largeur minimale Material */
        
        /* Augmenter la zone de clic pour les doigts */
        padding: 4px;
        margin: 0 4px; 
        
        transition: color 0.2s;
    }

 .nav-item .nav-icon {
font-size: 18px; /* Taille standard des icônes */
margin-bottom: 4px; /* Espacement entre icône et label */
 }
    
    .nav-item .nav-label {
        font-size: 12px; /* Taille de police standard Material pour la nav bar */
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

.nav-item.active {
 color: #3f51b5; /* Couleur primaire ou d'accentuation (Bleu Indigo Material) */
}
    }
</style>

{@render children()}

<nav class="bottom-nav">
 {#each navItems as item}

 {@const href = item.href === '/' ? basePath : `${basePath}${item.href}`}

{@const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))}
 
<a 
 {href} 
class="nav-item"
class:active={isActive}
>

<span class="nav-icon">{@html item.icon}</span>
<span class="nav-label">{item.label}</span>
 </a>
{/each}
</nav>
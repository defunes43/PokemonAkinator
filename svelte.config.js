import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const repoName = 'PokemonAkinator'; 
const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

const base = isCapacitorBuild ? '' : `/${repoName}`; 

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		paths: {
            base: base, 
        },
		adapter: adapter({
      // Toutes les pages sont pré-rendues
      fallback: 'index.html' // Important pour une SPA
    })
	}
};

export default config;

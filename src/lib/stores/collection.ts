import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Store interne, initialisé à vide (aucun accès à localStorage côté serveur)
const collectionStore = writable<string[]>([]);

if (browser) {
  // Côté client uniquement : on recharge les données depuis localStorage
  const stored = JSON.parse(localStorage.getItem('collection') ?? '[]');
  collectionStore.set(stored);

  // Puis on garde le store synchronisé avec localStorage
  collectionStore.subscribe((val) => {
    localStorage.setItem('collection', JSON.stringify(val));
  });
}

export const collection = {
  subscribe: collectionStore.subscribe,
  add: (name: string) => {
    collectionStore.update((list) =>
      list.includes(name) ? list : [...list, name]
    );
  },
  clear: () => collectionStore.set([]),
};

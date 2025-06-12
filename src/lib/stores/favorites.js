import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialen Zustand aus localStorage laden
const storedFavorites = browser && localStorage.getItem('favorites');
const initialFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

// Favoriten mit Svelte store verwalten
export const favorites = writable(initialFavorites);

// Favorit hinzufügen
export function addFavorite(location) {
  favorites.update(favs => {
    const exists = favs.some(
      fav => fav.latitude === location.latitude && fav.longitude === location.longitude
    );
    
    if (!exists) {
      const newFavs = [...favs, location];
      if (browser) {
        localStorage.setItem('favorites', JSON.stringify(newFavs));
      }
      return newFavs;
    }
    
    return favs;
  });
}

// Favorit entfernen
export function removeFavorite(location) {
  favorites.update(favs => {
    const index = favs.findIndex(
      fav => fav.latitude === location.latitude && fav.longitude === location.longitude
    );
    
    if (index !== -1) {
      const newFavs = [...favs.slice(0, index), ...favs.slice(index + 1)];
      if (browser) {
        localStorage.setItem('favorites', JSON.stringify(newFavs));
      }
      return newFavs;
    }
    
    return favs;
  });
}

// Prüfen, ob ein Ort bereits Favorit ist
export function isFavorite(favs, location) {
  return favs.some(
    fav => fav.latitude === location.latitude && fav.longitude === location.longitude
  );
} 
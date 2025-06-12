import { favorites, removeFavorite, addFavorite } from '$lib/stores/favorites';
import { getBrowserLocation, getNearbyLocations, getCurrentWeather } from '$lib/api/weatherApi';

// Daten für einen Ort laden
export async function loadWeatherData(location) {
  try {
    const weatherData = await getCurrentWeather(location.latitude, location.longitude);
    return {
      ...location,
      weather: {
        temperature: weatherData.current.temperature_2m,
        weathercode: weatherData.current.weathercode,
        units: weatherData.current_units
      }
    };
  } catch (err) {
    console.error(`Fehler beim Laden der Wetterdaten für ${location.name}:`, err);
    return location;
  }
}

// Favoriten laden oder Standort-basierte Orte anzeigen
export async function loadLocations() {
  let locationsList = [];
  let error = null;
  
  try {
    let currentFavorites = [];
    const unsubscribe = favorites.subscribe(value => {
      currentFavorites = value;
    });
    unsubscribe();
    
    if (currentFavorites.length > 0) {
      const locationsWithWeather = await Promise.all(
        currentFavorites.map(location => loadWeatherData(location))
      );
      locationsList = locationsWithWeather;
      return { locationsList, locationMode: 'favorites', error: null };
    } else {
      const { latitude, longitude } = await getBrowserLocation();
      const nearbyLocations = await getNearbyLocations(latitude, longitude, 5);
      
      const locationsWithWeather = await Promise.all(
        nearbyLocations.map(location => loadWeatherData(location))
      );
      locationsList = locationsWithWeather;
      return { locationsList, locationMode: 'nearby', error: null };
    }
  } catch (err) {
    error = err.message || 'Fehler beim Laden der Orte';
    console.error(error);
    return { locationsList: [], locationMode: 'favorites', error };
  }
}

// Favorit entfernen
export function handleRemoveFavorite(location, locationsList) {
  removeFavorite(location);
  const updatedList = locationsList.filter(
    loc => !(loc.latitude === location.latitude && loc.longitude === location.longitude)
  );
  return updatedList;
}

// Favorit hinzufügen
export function handleAddFavorite(location, locationsList) {
  addFavorite(location);
  // Aktualisiere den Status in der Liste
  return locationsList.map(loc => ({
    ...loc,
    isFavorite: loc.latitude === location.latitude && loc.longitude === location.longitude
  }));
} 
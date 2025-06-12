import { writable, derived } from 'svelte/store';
import { geocodeCity, getCurrentWeather, getForecastWeather, getWeatherInfo, getBrowserLocation, getNearbyLocations } from '$lib/api/weatherApi';
import { favorites, addFavorite, removeFavorite, isFavorite } from '$lib/stores/favorites';

export const weatherState = writable({
  city: '',
  currentWeather: null,
  forecast: null,
  loading: false,
  error: null,
  currentLocation: null,
  visibleDays: 3
});

export const isFav = derived([weatherState, favorites], ([$weatherState, $favorites]) => 
  $weatherState.currentLocation ? isFavorite($favorites, $weatherState.currentLocation) : false
);

export async function fetchWeather(city) {
  try {
    weatherState.update(state => ({ ...state, loading: true, error: null }));
    
    // Aktualisiere die URL mit der neuen Stadt
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('city', encodeURIComponent(city));
    window.history.pushState({}, '', newUrl);
    
    // Aktualisiere den State mit der neuen Stadt
    weatherState.update(state => ({ ...state, city }));
    
    // Geocode die Stadt zu Koordinaten
    const geoData = await geocodeCity(city);
    const { latitude, longitude, name, country } = geoData;
    
    // Aktuelle Wetterdaten und Vorhersage parallel abrufen
    const [currentData, forecastData] = await Promise.all([
      getCurrentWeather(latitude, longitude),
      getForecastWeather(latitude, longitude, 7)
    ]);
    
    const currentLocation = {
      name: name,
      country: country,
      latitude: latitude,
      longitude: longitude
    };
    
    weatherState.update(state => ({
      ...state,
      currentLocation,
      currentWeather: {
        location: `${name}, ${country}`,
        current: currentData.current,
        weatherInfo: getWeatherInfo(currentData.current.weathercode, currentData.current.temperature_2m),
        units: currentData.current_units
      },
      forecast: {
        daily: forecastData.daily,
        hourly: forecastData.hourly,
        units: {
          temperature: forecastData.daily_units.temperature_2m_max,
          precipitation: forecastData.daily_units.precipitation_sum,
          probability: forecastData.daily_units.precipitation_probability_max
        }
      },
      visibleDays: 3,
      loading: false,
      error: null
    }));
  } catch (error) {
    console.error('Fehler beim Laden der Wetterdaten:', error);
    weatherState.update(state => ({
      ...state,
      loading: false,
      error: 'Fehler beim Laden der Wetterdaten'
    }));
  }
}

export async function fetchWeatherForCurrentLocation() {
  weatherState.update(state => ({ ...state, loading: true, error: null }));
  
  try {
    const { latitude, longitude } = await getBrowserLocation();
    const nearbyLocations = await getNearbyLocations(latitude, longitude);
    const nearestLocation = nearbyLocations[0];
    
    // Aktuelle Wetterdaten und Vorhersage parallel abrufen
    const [currentData, forecastData] = await Promise.all([
      getCurrentWeather(nearestLocation.latitude, nearestLocation.longitude),
      getForecastWeather(nearestLocation.latitude, nearestLocation.longitude, 7)
    ]);
    
    weatherState.update(state => ({
      ...state,
      currentLocation: nearestLocation,
      city: nearestLocation.name,
      currentWeather: {
        location: `${nearestLocation.name}, ${nearestLocation.country}`,
        current: currentData.current,
        weatherInfo: getWeatherInfo(currentData.current.weathercode, currentData.current.temperature_2m),
        units: currentData.current_units
      },
      forecast: {
        daily: forecastData.daily,
        hourly: forecastData.hourly,
        units: {
          temperature: forecastData.daily_units.temperature_2m_max,
          precipitation: forecastData.daily_units.precipitation_sum,
          probability: forecastData.daily_units.precipitation_probability_max
        }
      },
      visibleDays: 3
    }));
  } catch (err) {
    weatherState.update(state => ({
      ...state,
      error: err.message || 'Fehler beim Abrufen der Wetterdaten'
    }));
  } finally {
    weatherState.update(state => ({ ...state, loading: false }));
  }
}

export function toggleFavorite() {
  if (!$weatherState.currentLocation) return;
  $isFav ? removeFavorite($weatherState.currentLocation) : addFavorite($weatherState.currentLocation);
}

export function loadMoreDays() {
  weatherState.update(state => ({
    ...state,
    visibleDays: Math.min(state.visibleDays + 3, 7)
  }));
}

export async function initializeWeather() {
  try {
    weatherState.update(state => ({ ...state, loading: true, error: null }));
    
    // Prüfe URL-Parameter
    const searchParams = new URLSearchParams(window.location.search);
    const cityParam = searchParams.get('city');
    
    if (cityParam) {
      // Wenn eine Stadt in der URL angegeben ist, verwende diese
      const decodedCity = decodeURIComponent(cityParam);
      weatherState.update(state => ({ ...state, city: decodedCity }));
      await fetchWeather(decodedCity);
    } else if ($weatherState.city) {
      // Wenn keine Stadt in der URL, aber eine im State ist, verwende diese
      await fetchWeather($weatherState.city);
    } else {
      // Fallback auf den aktuellen Standort
      await fetchWeatherForCurrentLocation();
    }
  } catch (error) {
    console.error('Fehler beim Initialisieren des Wetters:', error);
    weatherState.update(state => ({
      ...state,
      loading: false,
      error: 'Fehler beim Laden der Wetterdaten'
    }));
  }
} 
<script>
  import { onMount } from 'svelte';
  import { favorites, removeFavorite, addFavorite, isFavorite } from '$lib/stores/favorites';
  import { getBrowserLocation, getNearbyLocations, getCurrentWeather } from '$lib/api/weatherApi';
  import FavoriteLocation from '$lib/components/FavoriteLocation.svelte';

  let locationsList = [];
  let loading = false;
  let error = null;
  let locationMode = 'favorites';

  // Daten für einen Ort laden
  async function loadWeatherData(location) {
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
  async function loadLocations() {
    loading = true;
    error = null;
    
    try {
      let currentFavorites = [];
      const unsubscribe = favorites.subscribe(value => {
        currentFavorites = value;
      });
      unsubscribe();
      
      if (currentFavorites.length > 0) {
        locationMode = 'favorites';
        const locationsWithWeather = await Promise.all(
          currentFavorites.map(location => loadWeatherData(location))
        );
        locationsList = locationsWithWeather;
      } else {
        locationMode = 'nearby';
        const { latitude, longitude } = await getBrowserLocation();
        const nearbyLocations = await getNearbyLocations(latitude, longitude, 5);
        
        const locationsWithWeather = await Promise.all(
          nearbyLocations.map(location => loadWeatherData(location))
        );
        locationsList = locationsWithWeather;
      }
    } catch (err) {
      error = err.message || 'Fehler beim Laden der Orte';
      console.error(error);
    } finally {
      loading = false;
    }
  }

  // Favorit entfernen
  function handleRemoveFavorite(location) {
    removeFavorite(location);
    locationsList = locationsList.filter(
      loc => !(loc.latitude === location.latitude && loc.longitude === location.longitude)
    );
    
    if (locationsList.length === 0) {
      loadLocations();
    }
  }

  // Favorit hinzufügen
  function handleAddFavorite(location) {
    addFavorite(location);
    // Aktualisiere den Status in der Liste
    locationsList = locationsList.map(loc => ({
      ...loc,
      isFavorite: loc.latitude === location.latitude && loc.longitude === location.longitude
    }));
  }

  // Beim ersten Laden Orte abrufen
  onMount(() => {
    loadLocations();
  });

  // Automatische Aktualisierung alle 5 Minuten
  let updateInterval;
  onMount(() => {
    updateInterval = setInterval(loadLocations, 5 * 60 * 1000);
    return () => clearInterval(updateInterval);
  });
</script>

<div class="container mx-auto p-4 max-w-4xl">
  <h1 class="text-3xl font-bold mb-6 text-center">
    {locationMode === 'favorites' ? 'Meine Lieblingsorte' : 'Orte in meiner Nähe'}
  </h1>
  
  {#if loading}
    <div class="flex justify-center items-center p-12">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {/if}
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{error}</p>
    </div>
  {/if}
  
  {#if locationsList.length === 0 && !loading && !error}
    <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <p>Keine Orte gefunden. Fügen Sie Orte zu Ihren Favoriten hinzu oder aktivieren Sie die Standortfreigabe.</p>
    </div>
  {/if}
  
  <!-- Ortsliste -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each locationsList as location (location.latitude + location.longitude)}
      <FavoriteLocation
        {location}
        onRemove={handleRemoveFavorite}
        onAddFavorite={handleAddFavorite}
        isFavorite={locationMode === 'favorites'}
      />
    {/each}
  </div>
</div> 
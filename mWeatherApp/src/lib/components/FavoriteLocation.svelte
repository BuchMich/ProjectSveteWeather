<script>
  import { getWeatherInfo } from '$lib/api/weatherApi';
  
  export let location;
  export let onRemove;
  export let isFavorite = false;
  export let onAddFavorite;
  
  function handleRemove() {
    onRemove(location);
  }
  
  function handleAddFavorite() {
    onAddFavorite(location);
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
  <!-- Header mit Ort und Favoriten-Button -->
  <div class="flex justify-between items-center p-4 border-b">
    <h2 class="text-xl font-semibold">{location.name}, {location.country}</h2>
    
    {#if isFavorite}
      <button 
        on:click={handleRemove}
        class="text-red-500 hover:text-red-700 transition-colors"
        title="Aus Favoriten entfernen"
        aria-label="Aus Favoriten entfernen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    {:else}
      <button 
        on:click={handleAddFavorite}
        class="text-gray-500 hover:text-yellow-500 transition-colors"
        title="Zu Favoriten hinzufügen"
        aria-label="Zu Favoriten hinzufügen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
    {/if}
  </div>
  
  <!-- Wetterdaten, falls vorhanden -->
  {#if location.weather}
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="text-3xl font-bold">
          {location.weather.temperature}{location.weather.units.temperature_2m}
        </div>
        
        {#if location.weather.weathercode !== undefined}
          <div class="text-3xl">
            {getWeatherInfo(location.weather.weathercode, location.weather.temperature).icon}
          </div>
        {/if}
      </div>
      
      {#if location.weather.weathercode !== undefined}
        <div class="mt-2 text-gray-600">
          {getWeatherInfo(location.weather.weathercode, location.weather.temperature).description}
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- Link zur detaillierten Ansicht -->
  <div class="p-4 bg-gray-50">
    <a 
      href="/?city={encodeURIComponent(location.name)}" 
      class="block w-full text-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
    >
      Details anzeigen
    </a>
  </div>
</div> 
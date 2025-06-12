<script>
  import { onMount } from 'svelte';
  import { geocodeCity } from '$lib/api/weatherApi';
  import { debounce } from '$lib/utils';

  export let city = '';
  export let loading = false;
  export let onSearch;
  export let onLocationClick = null;

  let suggestions = [];
  let showSuggestions = false;
  let searchTimeout;

  // Debounced Funktion für die Suche
  const debouncedSearch = debounce(async (searchTerm) => {
    if (!searchTerm.trim()) {
      suggestions = [];
      return;
    }

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=5&language=de`
      );
      const data = await response.json();
      
      if (data.results) {
        suggestions = data.results.map(location => ({
          name: location.name,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude
        }));
      } else {
        suggestions = [];
      }
    } catch (error) {
      console.error('Fehler bei der Standortsuche:', error);
      suggestions = [];
    }
  }, 300);

  // Suche bei Eingabe
  function handleInput(event) {
    const searchTerm = event.target.value;
    debouncedSearch(searchTerm);
    showSuggestions = true;
  }

  // Vorschlag auswählen
  function selectSuggestion(suggestion) {
    city = suggestion.name;
    suggestions = [];
    showSuggestions = false;
    onSearch();
  }

  // Klick außerhalb der Vorschläge
  function handleClickOutside(event) {
    if (!event.target.closest('.search-container')) {
      showSuggestions = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="mb-8 search-container relative">
  <form on:submit|preventDefault={onSearch} class="flex gap-2">
    <div class="flex-1 relative">
      <input
        type="text"
        bind:value={city}
        on:input={handleInput}
        placeholder="Stadt eingeben..."
        class="w-full px-4 py-2 border rounded-lg"
      />
      
      {#if showSuggestions && suggestions.length > 0}
        <div class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {#each suggestions as suggestion}
            <button
              type="button"
              class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              on:click={() => selectSuggestion(suggestion)}
            >
              {suggestion.name}, {suggestion.country}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <button 
      type="submit" 
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
      disabled={loading}
    >
      {loading ? 'Laden...' : 'Suchen'}
    </button>
    
    {#if onLocationClick}
      <button 
        type="button"
        on:click={onLocationClick}
        class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg"
        title="Meinen Standort verwenden"
        disabled={loading}
      >
        📍
      </button>
    {/if}
  </form>
</div>

<style>
  .search-container {
    position: relative;
  }
</style> 
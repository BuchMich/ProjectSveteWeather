<script>
  import { onMount } from 'svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import TemperatureGraph from '$lib/components/TemperatureGraph.svelte';
  import CurrentWeather from '$lib/components/CurrentWeather.svelte';
  import DailyForecast from '$lib/components/DailyForecast.svelte';
  import HourlyForecast from '$lib/components/HourlyForecast.svelte';
  import { weatherState, fetchWeather, fetchWeatherForCurrentLocation, toggleFavorite, initializeWeather } from '$lib/services/weatherService';

  onMount(() => {
    initializeWeather();
    if (!$weatherState.city) {
      fetchWeatherForCurrentLocation();
    }
  });

  function handleSearch() {
    fetchWeather($weatherState.city);
  }
</script>

<div class="container mx-auto p-4 max-w-4xl">
  <SearchBar 
    bind:city={$weatherState.city}
    loading={$weatherState.loading}
    onSearch={handleSearch}
    onLocationClick={fetchWeatherForCurrentLocation}
  />
  
  {#if $weatherState.error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{$weatherState.error}</p>
    </div>
  {/if}
  
  {#if $weatherState.loading}
    <div class="flex flex-col items-center justify-center py-12">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {/if}
  
  {#if $weatherState.currentWeather}
    <CurrentWeather 
      currentWeather={$weatherState.currentWeather}
      currentLocation={$weatherState.currentLocation}
      onToggleFavorite={toggleFavorite}
    />

    {#if $weatherState.forecast}
      <DailyForecast 
        forecast={$weatherState.forecast}
        units={$weatherState.forecast.units}
      />

      <div class="mt-8">
        <h3 class="text-2xl font-semibold mb-6">Nächste Stunden</h3>
        
        <TemperatureGraph 
          forecast={$weatherState.forecast}
          units={$weatherState.forecast.units}
        />

        <HourlyForecast 
          forecast={$weatherState.forecast}
          units={$weatherState.forecast.units}
        />
      </div>
    {/if}
  {/if}
</div> 
<script>
  import { getWeatherInfo } from '$lib/api/weatherApi';
  import { isFavorite } from '$lib/stores/favorites';
  import { favorites } from '$lib/stores/favorites';

  export let currentWeather;
  export let currentLocation;
  export let onToggleFavorite;

  function getWeatherClasses(theme) {
    const themes = {
      'sunny': 'bg-gradient-to-br from-yellow-100 to-yellow-300 text-yellow-900',
      'partly-cloudy': 'bg-gradient-to-br from-blue-100 to-gray-200 text-gray-900',
      'cloudy': 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900',
      'foggy': 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-900',
      'rainy': 'bg-gradient-to-br from-blue-200 to-blue-400 text-blue-900',
      'stormy': 'bg-gradient-to-br from-purple-200 to-gray-700 text-white',
      'snowy': 'bg-gradient-to-br from-blue-100 to-gray-100 text-blue-900',
      'default': 'bg-white'
    };
    
    return `rounded-lg shadow-md p-6 ${themes[theme] || themes.default}`;
  }
</script>

<div class={getWeatherClasses(currentWeather.weatherInfo.theme)}>
  <div class="flex justify-between items-start mb-6">
    <div>
      <h2 class="text-3xl font-semibold mb-2">{currentWeather.location}</h2>
      <div class="flex items-center gap-4">
        <span class="text-5xl font-bold">{currentWeather.current.temperature_2m}{currentWeather.units.temperature_2m}</span>
        <span class="text-4xl">{currentWeather.weatherInfo.icon}</span>
      </div>
      <p class="text-xl mt-2">{currentWeather.weatherInfo.description}</p>
    </div>
    <button
      on:click={onToggleFavorite}
      class="text-3xl transition-transform transform hover:scale-110"
      title={isFavorite($favorites, currentLocation) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
    >
      {isFavorite($favorites, currentLocation) ? '★' : '☆'}
    </button>
  </div>
  
  <div class="grid grid-cols-3 gap-6 mt-8">
    <div class="bg-white bg-opacity-70 p-4 rounded-lg">
      <p class="text-gray-600">Luftfeuchtigkeit</p>
      <p class="text-xl font-semibold">{currentWeather.current.relative_humidity_2m}{currentWeather.units.relative_humidity_2m}</p>
    </div>
    <div class="bg-white bg-opacity-70 p-4 rounded-lg">
      <p class="text-gray-600">Niederschlag</p>
      <p class="text-xl font-semibold">{currentWeather.current.precipitation}{currentWeather.units.precipitation}</p>
    </div>
    <div class="bg-white bg-opacity-70 p-4 rounded-lg">
      <p class="text-gray-600">Wind</p>
      <p class="text-xl font-semibold">{currentWeather.current.wind_speed_10m}{currentWeather.units.wind_speed_10m}</p>
    </div>
  </div>
</div> 
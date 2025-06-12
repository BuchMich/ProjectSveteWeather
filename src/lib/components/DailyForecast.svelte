<script>
  import { getWeatherInfo } from '$lib/api/weatherApi';

  export let forecast;
  export let units;

  function getWeatherCardClasses(weathercode) {
    const theme = getWeatherInfo(weathercode).theme;
    
    const themeClasses = {
      'sunny': 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300',
      'mostly-clear': 'bg-gradient-to-br from-blue-50 to-yellow-100 border-blue-200',
      'partly-cloudy': 'bg-gradient-to-br from-blue-50 to-gray-100 border-blue-200',
      'cloudy': 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300',
      'foggy': 'bg-gradient-to-br from-gray-100 to-gray-300 border-gray-400',
      'rainy': 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300',
      'drizzle': 'bg-gradient-to-br from-blue-50 to-blue-200 border-blue-300',
      'stormy': 'bg-gradient-to-br from-purple-100 to-gray-300 border-purple-400',
      'snowy': 'bg-gradient-to-br from-blue-50 to-gray-100 border-blue-200',
      'freezing': 'bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-300',
      'default': 'bg-gray-50 border-gray-200'
    };
    
    return `p-4 rounded-lg border ${themeClasses[theme] || themeClasses.default}`;
  }
</script>

<div class="mt-8">
  <h3 class="text-2xl font-semibold mb-6">Wettervorhersage</h3>

  <div class="relative">
    <!-- Scrollbarer Container -->
    <div class="overflow-x-auto pb-4 scrollbar-hide">
      <div class="flex gap-4 min-w-max">
        {#each forecast.daily.time as time, i}
          <div class="w-64 flex-shrink-0">
            <div class={getWeatherCardClasses(forecast.daily.weathercode[i])}>
              <h4 class="font-medium text-lg mb-2 text-center truncate">
                {new Date(time).toLocaleDateString('de-DE', {weekday: 'short', day: 'numeric', month: 'numeric'})}
              </h4>
              
              <div class="flex justify-center my-3 text-4xl">
                {getWeatherInfo(forecast.daily.weathercode[i], forecast.daily.temperature_2m_max[i]).icon}
              </div>
              
              <p class="text-sm text-center mb-3 line-clamp-2 min-h-[2.5rem]">
                {getWeatherInfo(forecast.daily.weathercode[i], forecast.daily.temperature_2m_max[i]).description}
              </p>
              
              <div class="flex justify-between text-sm font-medium mb-3">
                <span class="text-blue-600">{forecast.daily.temperature_2m_min[i]}{units.temperature}</span>
                <span class="text-red-600">{forecast.daily.temperature_2m_max[i]}{units.temperature}</span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-gray-600 block text-xs">Niederschlag</span>
                  <span class="font-medium">{forecast.daily.precipitation_sum[i]}{units.precipitation}</span>
                </div>
                <div>
                  <span class="text-gray-600 block text-xs">Wahrscheinlichkeit</span>
                  <span class="font-medium">{forecast.daily.precipitation_probability_max[i]}{units.probability}</span>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Scroll-Indikatoren -->
    <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
    <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Verstecke Scrollbar aber behalte Funktionalität */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
</style> 
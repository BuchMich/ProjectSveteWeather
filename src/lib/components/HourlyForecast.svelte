<script>
  import { getWeatherInfo } from '$lib/api/weatherApi';

  export let forecast;
  export let units;
</script>

<div class="relative">
  <div class="overflow-x-auto pb-4 scrollbar-hide">
    <div class="flex gap-4 min-w-max">
      {#each forecast.hourly.time as time, i}
        <div class="w-32 flex-shrink-0">
          <div class="bg-white rounded-lg shadow p-3 border border-gray-200">
            <h4 class="font-medium text-sm mb-2 text-center">
              {new Date(time).toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}
            </h4>
            
            <div class="flex justify-center my-2 text-2xl">
              {getWeatherInfo(forecast.hourly.weathercode[i], forecast.hourly.temperature_2m[i]).icon}
            </div>
            
            <div class="text-center">
              <span class="text-lg font-medium">{forecast.hourly.temperature_2m[i]}{units.temperature}</span>
            </div>
            
            <div class="mt-2 text-xs text-center text-gray-600">
              <div class="flex items-center justify-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                {forecast.hourly.precipitation_probability[i]}{units.probability}
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

<style>
  /* Verstecke Scrollbar aber behalte Funktionalität */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
</style> 
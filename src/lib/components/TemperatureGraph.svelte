<script>
  import { onMount } from 'svelte';
  import { getWeatherInfo } from '$lib/api/weatherApi';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);

  export let forecast;
  export let units;
  export let timeRange = '24h'; // '12h', '24h', 'daily'

  let chart;
  let chartContainer;

  function getCurrentHourIndex() {
    const now = new Date();
    const currentHour = now.getHours();
    return forecast.hourly.time.findIndex(time => {
      const date = new Date(time);
      return date.getHours() === currentHour;
    });
  }

  function updateTemperatureChart() {
    if (!chart || !forecast) return;

    const startIndex = getCurrentHourIndex();
    if (startIndex === -1) return;

    let dataPoints;
    let labels;

    switch (timeRange) {
      case '12h':
        dataPoints = forecast.hourly.temperature_2m.slice(startIndex, startIndex + 12);
        labels = forecast.hourly.time.slice(startIndex, startIndex + 12).map(time => 
          new Date(time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
        );
        break;
      case '24h':
        dataPoints = forecast.hourly.temperature_2m.slice(startIndex, startIndex + 24);
        labels = forecast.hourly.time.slice(startIndex, startIndex + 24).map(time => 
          new Date(time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
        );
        break;
      case 'daily':
        dataPoints = forecast.daily.temperature_2m_max;
        labels = forecast.daily.time.map(time => 
          new Date(time).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' })
        );
        break;
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = dataPoints;
    chart.update();
  }

  onMount(() => {
    const ctx = chartContainer.getContext('2d');
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: `Temperatur (${units.temperature})`,
          data: [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `${context.parsed.y}${units.temperature}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              callback: function(value) {
                return value + units.temperature;
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });

    updateTemperatureChart();
  });

  $: if (chart && forecast && timeRange) {
    updateTemperatureChart();
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <div class="flex justify-between items-center mb-6">
    <h3 class="text-2xl font-semibold">Temperaturverlauf</h3>
    <div class="flex gap-2">
      <button 
        class="px-3 py-1 rounded {timeRange === '12h' ? 'bg-blue-500 text-white' : 'bg-gray-100'}"
        on:click={() => timeRange = '12h'}
      >
        12h
      </button>
      <button 
        class="px-3 py-1 rounded {timeRange === '24h' ? 'bg-blue-500 text-white' : 'bg-gray-100'}"
        on:click={() => timeRange = '24h'}
      >
        24h
      </button>
      <button 
        class="px-3 py-1 rounded {timeRange === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-100'}"
        on:click={() => timeRange = 'daily'}
      >
        Täglich
      </button>
    </div>
  </div>
  
  <div class="h-64">
    <canvas bind:this={chartContainer}></canvas>
  </div>
</div> 
<script lang="ts">
  import { onMount } from 'svelte'
  import type { ChartItem } from 'chart.js'
  import { Chart, registerables } from 'chart.js'
  import type { ChartConfiguration } from 'chart.js'

  export let type: ChartConfiguration['type']
  export let data: ChartConfiguration['data']
  export let options: ChartConfiguration['options']
  export let plugins: ChartConfiguration['plugins'] = []

  const initializeChart = async () => {
    // register all charts
    Chart.register(...registerables)

    // grab the canvas element to initialize the chart with
    const ctx = document.getElementById('myChart') as ChartItem

    new Chart(ctx, {
      type,
      data,
      options: {
        maintainAspectRatio: false,
        ...options,
      },
      plugins,
    })
  }

  // initialize the chart after the page mounts on the client
  onMount(initializeChart)
</script>

<div class="min-h-[500px] w-full">
  <canvas id="myChart" />
</div>

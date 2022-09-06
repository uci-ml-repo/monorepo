<script lang="ts">
  import { onMount } from 'svelte'
  import type { ChartItem } from 'chart.js'
  import { Chart, registerables } from 'chart.js'

  const initializeChart = async () => {
    // register all charts
    Chart.register(...registerables)

    // grab the canvas element to initialize the chart with
    const ctx = document.getElementById('myChart') as ChartItem

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  // initialize the chart after the page mounts on the client
  onMount(initializeChart)
</script>

<div class="max-w-full">
  <canvas id="myChart" />
</div>

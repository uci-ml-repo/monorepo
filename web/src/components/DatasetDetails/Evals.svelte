<script lang="ts">
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import Chart from '$components/Chart/index.svelte'
  import Tabs from '$components/Tabs.svelte'

  export let ID = 0

  const evalsQuery = useQuery(
    ['evals.getByDatasetId', ID],
    async () => await trpc(fetch).query('evals.getByDatasetId', ID)
  )

  import type { ChartConfiguration, ChartData } from 'chart.js'

  // an array of Evals are required to initialize the chart properly
  //////////////////////////////////////////
  interface Eval {
    models: {
      args: string | null
      code: string
      name: string
      task: string
    }
    metrics: {
      args: string | null
      code: string
      name: string
      task: string
    }
    ID: number
    datasetID: number
    metricID: number
    modelID: number
    metric: number | null
    lowerBound: number | null
    upperBound: number | null
  }

  const chartColors = {
    main: '#0D66A2',
  }

  // given a metric data array, e.g. either returned from the function below
  // generate options for displaying the chart
  //////////////////////////////////////////
  export function getOptions(metricData: ChartData['datasets']) {
    const options: ChartConfiguration['options'] = {
      animation: {
        duration: 0,
      },
      layout: {},
      scales: {
        x: {
          grid: {
            drawTicks: false,
            borderWidth: 0.4,
          },
          ticks: {
            callback: (value) => {
              const label = value as number
              return label !== 1.02 ? label : ''
            },
            padding: 20,
          },
        },
        y: {
          max: metricData.length + 1,
          grid: {
            drawTicks: false,
            drawOnChartArea: false,
            lineWidth: 0.4,
          },
          ticks: {
            color: chartColors.main,
            // instead of a normal y-axis, label it only with labels from
            // accuracy or precision (function below)
            callback: function (value) {
              const index = (value as number) - 1
              return metricData[index] != null ? metricData[index].label : ''
            },
            padding: 20,
          },
        },
      },
      plugins: {
        // the default Y axis labels are overriden by the ticks callback function
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            // on hover, the title of the tooltip will be a precision 3 decimal number
            title: function (tooltipItems) {
              if (typeof tooltipItems !== 'string') {
                return ((tooltipItems[0].parsed.x * 1000) / 1000).toFixed(3)
              }
              return ''
            },
            // don't display any additional info in the tooltip
            label: () => '',
          },
        },
      },
    }
    return options
  }

  // generate an array of data points for the chart based on the type of eval
  //////////////////////////////////////////
  export function setEvalsData(evals: Eval[]) {
    const accuracy: ChartData['datasets'] = []
    const precision: ChartData['datasets'] = []

    // for each eval, push 2 points onto the chart
    evals.forEach((e) => {
      // label will be an array of capitalized names
      const labels = e.models.name
        .split(' ')
        .map((label) => label.charAt(0).toUpperCase() + label.slice(1)) as never

      // if any properties are null, ignore the point
      if (!e.metric || !e.lowerBound || !e.upperBound) {
        return
      }

      // push datapoints into the array depending on whether they're for precision or accuracy
      switch (e.metrics.name) {
        case 'accuracy':
          accuracy.push(
            ...[
              {
                // label needs a string, but an array works fine, so cast to never above
                label: labels,
                backgroundColor: chartColors.main,

                // the first data point is a dot in the center of the line data point below
                data: [{ x: e.metric, y: accuracy.length + 1 }],
              },
              {
                type: 'line' as const,
                pointStyle: 'cross',
                backgroundColor: chartColors.main,
                borderColor: chartColors.main,
                borderWidth: 2,

                // a horizonal line is made at the y-position, between the lower and upper bounds
                // the object above is a dot on the same horizontal line in the middle
                data: [
                  { x: e.lowerBound, y: accuracy.length + 1 },
                  { x: e.upperBound, y: accuracy.length + 1 },
                ],
              },
            ]
          )
          break

        // same logic above as above, could be optimized later
        case 'precision':
          precision.push(
            ...[
              {
                label: labels,
                backgroundColor: chartColors.main,
                data: [{ x: e.metric, y: precision.length + 1 }],
              },
              {
                type: 'line' as const,
                pointStyle: 'cross',
                backgroundColor: chartColors.main,
                borderColor: chartColors.main,
                borderWidth: 2,
                data: [
                  { x: e.lowerBound, y: precision.length + 1 },
                  { x: e.upperBound, y: precision.length + 1 },
                ],
              },
            ]
          )
          break
      }
    })
    return {
      accuracy,
      precision,
    }
  }
  $: evalType = 'accuracy'

  $: evalsData = setEvalsData($evalsQuery.data || [])
  $: accuracy = evalsData.accuracy
  $: precision = evalsData.precision

  $: accuracyData = {
    datasets: accuracy,
  }

  $: precisionData = {
    datasets: precision,
  }
  const options = [
    { label: 'Accuracy', value: 'accuracy' },
    { label: 'Precision', value: 'precision' },
  ]
</script>

<div class="overflow-x-auto">
  <Tabs {options} bind:value={evalType} class="flex justify-center font-bold" />
  <div class="min-h-[500px] min-w-[500px]">
    {#if precision?.length > 0 && evalType === 'accuracy'}
      <Chart type="bubble" data={accuracyData} options={getOptions(accuracy)} />
    {:else if accuracy?.length > 0 && evalType === 'precision'}
      <Chart type="bubble" data={precisionData} options={getOptions(precision)} />
    {/if}
  </div>
</div>

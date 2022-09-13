<script lang="ts">
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import Chart from '$components/Chart/index.svelte'
  import Tabs from '$components/Tabs.svelte'

  import { getOptions, setEvalsData } from '$components/Chart/helpers'

  export let ID = 0

  // query for all the evals for this dataset
  //////////////////////////////////////////
  const evalsQuery = useQuery(
    ['evals.getByDatasetId', ID],
    async () => await trpc(fetch).query('evals.getByDatasetId', ID)
  )

  // use the helper to generate raw data for the accuracy and precision charts
  $: evalsData = setEvalsData($evalsQuery.data || [])

  // chart setup
  ////////////////////////////////////////////

  // just the raw data for the charts, used to calculate chart options
  $: accuracy = evalsData.accuracy
  $: precision = evalsData.precision

  // configuration for the chart, e.g. with the data
  $: accuracyData = {
    datasets: accuracy,
  }

  $: precisionData = {
    datasets: precision,
  }

  // tab controls
  ////////////////////////////////////////////
  $: evalType = 'accuracy'
  const options = [
    { label: 'Accuracy', value: 'accuracy' },
    { label: 'Precision', value: 'precision' },
  ]
</script>

<div class="overflow-x-auto">
  {#if accuracy.length || precision.length}
    <div class="flex justify-center">
      <Tabs {options} bind:value={evalType} />
    </div>
    <div class="min-h-[500px] min-w-[500px]">
      {#if precision?.length > 0 && evalType === 'accuracy'}
        <Chart type="bubble" data={accuracyData} options={getOptions(accuracy)} />
      {:else if accuracy?.length > 0 && evalType === 'precision'}
        <Chart type="bubble" data={precisionData} options={getOptions(precision)} />
      {/if}
    </div>
  {:else}
    <p class="text-xl">N/A</p>
  {/if}
</div>

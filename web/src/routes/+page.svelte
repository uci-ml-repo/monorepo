<script lang="ts">
  import type { InferQueryOutput } from '$lib/trpc'
  import DatasetGridRow from '$components/DatasetGridRow.svelte'
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  const nameResult = useQuery(
    'donated_datasets.searchDatasets',
    async () => await trpc(fetch).query('donated_datasets.searchDatasets')
  )

  export let data: {
    newDatasets: InferQueryOutput<'donated_datasets.getDatasets'>
    popularDatasets: InferQueryOutput<'donated_datasets.getDatasets'>
    count: InferQueryOutput<'donated_datasets.getCount'>
  }
</script>

<svelte:head>
  <title>UC Irvine Machine Learning Repository</title>
</svelte:head>

<main class="px-4 max-w-screen-2xl mx-auto flex flex-col gap-6">
  {JSON.stringify($nameResult.data)}
  <!-- hero section / welcome banner -->
  <div class="hero mx-auto">
    <div class="hero-content text-center">
      <div class="max-w-md flex flex-col gap-6">
        <h1 class="text-3xl text-primary font-bold">
          Welcome to the UC Irvine Machine Learning Repository
        </h1>
        <p>
          We currently maintain {data.count} datasets as a service to the machine learning community.
          Here, you can donate and find datasets used by millions of people all around the world!
        </p>
        <div class="flex justify-center gap-5 flex-wrap">
          <a href="/datasets" class="btn btn-primary">View Datasets</a>
          <a href="/" class="btn btn-secondary">Contribute a Dataset</a>
        </div>
      </div>
    </div>
  </div>

  <!-- featured dataset grid display -->
  <div class="grid grid-cols-1 xl:grid-cols-2 w-full">
    <div class="flex flex-col col-span-1 gap-3 p-4">
      <h1 class="text-center text-2xl text-primary font-bold">Popular Datasets</h1>
      {#each data.popularDatasets || [] as dataset}
        <DatasetGridRow {dataset} />
        <div class="divider my-0" />
      {/each}
    </div>

    <div class="flex flex-col col-span-1 gap-3 p-4">
      <h1 class="text-center text-2xl text-primary font-bold">New Datasets</h1>
      {#each data.newDatasets || [] as dataset}
        <DatasetGridRow {dataset} />
        <div class="divider my-0" />
      {/each}
    </div>
  </div>
</main>

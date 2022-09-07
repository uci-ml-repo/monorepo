<script lang="ts">
  import type { InferQueryOutput } from '$lib/trpc'
  import DatasetGridRow from '$components/DatasetGridRow.svelte'

  export let data: {
    newDatasets: InferQueryOutput<'donated_datasets.getDatasets'>
    popularDatasets: InferQueryOutput<'donated_datasets.getDatasets'>
    count: InferQueryOutput<'donated_datasets.getCount'>
  }
</script>

<svelte:head>
  <title>Datasets - UC Irvine Machine Learning Repository</title>
</svelte:head>

<div class="flex">
  <div class="hidden lg:flex w-[20%]">
    <h1 class="text-4xl text-primary font-bold">Sidebar</h1>
  </div>
  <div class="flex flex-col col-span-1 gap-3 p-4">
    <h1 class="text-4xl text-primary font-bold">Browse Datasets</h1>
    {#each data.popularDatasets || [] as dataset}
      <DatasetGridRow {dataset} extraInfo />
      <div class="divider my-0" />
    {/each}
  </div>
</div>

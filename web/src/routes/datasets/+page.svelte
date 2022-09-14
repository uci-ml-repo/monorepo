<script lang="ts">
  import Pagination from '$components/Pagination.svelte'
  import DatasetFilterSidebar from '$components/DatasetFilter.svelte'
  import SortBy from '$components/SortBy.svelte'

  import EyeSlash from '$components/Icons/EyeSlash.svelte'
  import Eye from '$components/Icons/Eye.svelte'

  import type { InferQueryOutput } from '$lib/trpc'
  import DatasetGridRow from '$components/DatasetGridRow.svelte'

  export let data: {
    datasets: InferQueryOutput<'donated_datasets.getDatasets'>
    count: InferQueryOutput<'donated_datasets.getCount'>
  }

  $: datasets = data.datasets || []

  let showAll = false

  let currentPage = 0
  let rowsPerPage = 10

  const updateDatasets = (e: CustomEvent) => {
    const newDatasets = e.detail.datasets
    datasets = newDatasets
  }
</script>

<svelte:head>
  <title>Datasets - UC Irvine Machine Learning Repository</title>
</svelte:head>

<div class="flex flex-col md:flex-row">
  <!-- filters will appear as a sidebar will show up on the left if the screen is large -->
  <div class="hidden lg:block w-96">
    <DatasetFilterSidebar on:update={updateDatasets} />
  </div>
  <div class="flex flex-col col-span-1 gap-1 p-4 w-full">
    <!-- filters will appear as dropdown button under the header if screen is small-->
    <div class="flex flex-col gap-5">
      <!-- title -->
      <h1 class="text-4xl text-primary font-bold">Browse Datasets</h1>

      <!-- row of buttons underneath the title -->
      <div class="flex gap-4 items-center">
        <!-- filter button and sidebar moved into a dropdown -->
        <div class="dropdown block lg:hidden">
          <label for="filter-dropdown" tabindex="0" class="btn btn-sm btn-secondary m-1"
            >Filters</label
          >
          <div
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-72"
          >
            <DatasetFilterSidebar on:update(updateDatasets) />
          </div>
        </div>

        <!-- sort by button -->
        <SortBy />
        <!-- eye icons for triggering show all -->
        <label class="swap">
          <input type="checkbox" aria-label="show-all-toggle" bind:checked={showAll} />
          <Eye class="swap-off btn btn-ghost btn-sm btn-circle fill-primary" />
          <EyeSlash class="swap-on btn btn-ghost btn-sm btn-circle fill-primary" />
        </label>
      </div>
    </div>

    <!-- all of the datasets mapped to rows -->
    {#each datasets.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage) || [] as dataset}
      <DatasetGridRow {dataset} extraInfo {showAll} />
      <div class="divider my-0" />
    {/each}

    <!-- pagination options -->
    <Pagination data={datasets} bind:rowsPerPage bind:currentPage />
  </div>
</div>

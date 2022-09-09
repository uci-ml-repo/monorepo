<script lang="ts">
  import DatasetFilterSidebar from '$components/DatasetFilterSidebar/index.svelte'
  import SortBy from '$components/SortBy.svelte'

  import PageRight from '$components/Icons/PageRight.svelte'
  import PageLeft from '$components/Icons/PageLeft.svelte'

  import EyeSlash from '$components/Icons/EyeSlash.svelte'
  import Eye from '$components/Icons/Eye.svelte'

  import type { InferQueryOutput } from '$lib/trpc'
  import DatasetGridRow from '$components/DatasetGridRow.svelte'

  export let data: {
    datasets: InferQueryOutput<'donated_datasets.getDatasets'>
    count: InferQueryOutput<'donated_datasets.getCount'>
  }

  let showAll = false

  let currentPage = 0
  let rowsPerPage = 10

  const rowsPerPageOptions = [10, 25, 50, 100, 250, 500]

  $: maxPage = data?.datasets?.length / rowsPerPage - 1

  let nextPage = () => {
    if (currentPage < maxPage) {
      currentPage += 1
    }
  }

  let prevPage = () => {
    if (currentPage > 0) {
      currentPage -= 1
    }
  }
</script>

<svelte:head>
  <title>Datasets - UC Irvine Machine Learning Repository</title>
</svelte:head>

<div class="flex flex-col md:flex-row">
  <!-- filters will appear as a sidebar will show up on the left if the screen is large -->
  <div class="hidden lg:block w-96">
    <DatasetFilterSidebar />
  </div>
  <div class="flex flex-col col-span-1 gap-3 p-4 w-full">
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
            <DatasetFilterSidebar />
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
    {#each data.datasets.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage) || [] as dataset}
      <DatasetGridRow {dataset} extraInfo {showAll} />
      <div class="divider my-0" />
    {/each}

    <!-- pagination options -->
    <div class="flex justify-end gap-4 items-center flex-wrap">
      <div class="flex justify-evenly items-center gap-6">
        <label for="select-page">Rows per Page</label>
        <select
          id="select-page"
          class="select select-sm select-bordered w-20"
          bind:value={rowsPerPage}
        >
          {#each rowsPerPageOptions as option}
            <option>{option}</option>
          {/each}
        </select>
        <span class="text-sm">
          <span>{currentPage * rowsPerPage + 1}</span>
          to <span>10</span> of
          <span>{data.datasets?.length || 0}</span>
        </span>
      </div>
      <div class="btn-group grid grid-cols-2">
        <button
          class="btn btn-ghost btn-circle btn-sm"
          on:click={prevPage}
          disabled={currentPage === 0}
        >
          <PageLeft />
        </button>
        <button
          class="btn btn-ghost btn-circle btn-sm"
          on:click={nextPage}
          disabled={currentPage === maxPage}
        >
          <PageRight />
        </button>
      </div>
    </div>
  </div>
</div>

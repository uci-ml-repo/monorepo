<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import Eye from '$components/Icons/Eye.svelte'
  import EyeSlash from '$components/Icons/EyeSlash.svelte'

  import Pagination from '$components/Pagination.svelte'

  import DatasetTableRow from '$components/Admin/DatasetTableRow.svelte'

  export let status = 'PENDING'

  const query = useQuery(['donated_datasets.getDatasets', { status }], async () => {
    return await trpc(fetch).query('donated_datasets.getDatasets', {
      status,
    })
  })

  $: datasets = $query.data || []

  let currentPage = 0
  let rowsPerPage = 10

  let showAll = false

  const toggleShowAll = () => (showAll = !showAll)
</script>

<div class="overflow-x-auto mx-auto gap-4 p-4">
  <button class="flex gap-4 my-4 btn btn-ghost" on:click={toggleShowAll}>
    <span class="text-xl">{showAll ? 'Close all' : 'Expand all'}</span>
    <div class="swap" class:swap-active={showAll}>
      <Eye class="swap-off btn btn-ghost btn-sm btn-circle fill-primary" />
      <EyeSlash class="swap-on btn btn-ghost btn-sm btn-circle fill-primary" />
    </div>
  </button>
  <table class="table w-full border">
    <tr>
      <th class="text-center" width="10%">Action</th>
      <th width="5%" />
      <th width="35%">Dataset Name</th>
      <th width="35%">User</th>
      <th width="15%">Date Donated</th>
    </tr>
    {#each datasets.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage) as dataset}
      <DatasetTableRow {dataset} {showAll} />
    {/each}
  </table>
  <Pagination data={datasets} bind:rowsPerPage bind:currentPage />
</div>

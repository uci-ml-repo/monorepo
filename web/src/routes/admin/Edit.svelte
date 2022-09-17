<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import type { edits_status } from '@prisma/client'
  import trpc from '$lib/trpc'

  import Eye from '$components/Icons/Eye.svelte'
  import EyeSlash from '$components/Icons/EyeSlash.svelte'

  import Pagination from '$components/UI/Pagination.svelte'

  import Edit from '$components/Admin/Edit.svelte'

  export let status: edits_status = 'ACCEPTED'

  const query = useQuery(['edits.find', { status }], async () => {
    return await trpc(fetch).query('edits.find', { status })
  })

  $: edits = $query.data || []

  let currentPage = 0
  let rowsPerPage = 10

  let showAll = false

  const toggleShowAll = () => (showAll = !showAll)
</script>

<div class="overflow-x-auto mx-auto p-4">
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
      <th width="15%">Edit</th>
      <th width="15%">Table</th>
      <th width="15%">User</th>
    </tr>
    {#each edits.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage) as edit}
      <Edit {edit} {showAll} />
    {/each}
  </table>
  <Pagination data={edits} bind:rowsPerPage bind:currentPage />
</div>

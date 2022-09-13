<script lang="ts">
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import Pagination from '$components/Pagination.svelte'

  const query = useQuery('notes.getAll', async () => await trpc(fetch).query('notes.getAll'))

  $: notes = $query.data || []

  let currentPage = 0
  let rowsPerPage = 10
</script>

<div class="overflow-x-auto mx-auto p-4">
  <table class="table w-full border">
    <tr>
      <th width="50%">Dataset Name</th>
      <th width="50%">Notes</th>
    </tr>
    {#each notes.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage) as note}
      <tr>
        <td>{note.notes}</td>
        <td>{note.donated_datasets.Name}</td>
      </tr>
    {/each}
  </table>
  <Pagination data={notes} bind:rowsPerPage bind:currentPage />
</div>

<script lang="ts">
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'
  import Pagination from '$components/Pagination.svelte'

  export let ID = 0

  // query for all papers related to this dataset
  //////////////////////////////////////////
  const query = useQuery(
    ['papers.getAllSummary', ID],
    async () => await trpc(fetch).query('papers.getAllSummary', ID)
  )

  $: papers = $query.data || []

  // pagination controls
  //////////////////////////////////////////
  let currentPage = 0
  let rowsPerPage = 5
  const rowsPerPageOptions = [5, 25, 50, 100, 200]
</script>

<div class="py-4">
  {#if papers.length}
    <!-- each paper is in its own div and stacked with flex-col -->
    <div class="flex flex-col gap-4">
      {#each papers.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage) as paper}
        <div>
          <a href={paper?.url} class="text text-primary text-lg font-semibold underline">
            <span>{paper?.title}</span>
          </a>
          <p>{paper?.people}</p>
          <p>{paper?.publication}</p>
        </div>
      {/each}
    </div>
    <Pagination bind:currentPage bind:rowsPerPage data={papers} {rowsPerPageOptions} />
  {:else}
    <p class="text-xl">N/A</p>
  {/if}
</div>

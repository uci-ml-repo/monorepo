<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'
  import CustomTable from '$components/CustomTable.svelte'

  export let ID = 0

  // get table data
  //////////////////////////////////////////
  const editQuery = useQuery(
    ['edits.getByDatasetId', ID],
    async () => await trpc(fetch).query('edits.getByDatasetId', ID)
  )

  // responsive values to extract the query data
  //////////////////////////////////////////
  $: data = $editQuery.data?.data || []
  $: headers = $editQuery.data?.headers || []
</script>

<div>
  {#if data.length}
    <CustomTable {data} {headers} />
  {:else}
    <p class="text-xl">N/A</p>
  {/if}
</div>

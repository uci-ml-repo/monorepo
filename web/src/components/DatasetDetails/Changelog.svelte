<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'
  import CustomTable from '$components/CustomTable.svelte'

  export let ID = 0

  const editQuery = useQuery(
    [],
    async () => await trpc(fetch).query('edits.getByDatasetId', ID)
  )

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

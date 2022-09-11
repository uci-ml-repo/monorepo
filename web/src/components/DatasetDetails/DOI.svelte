<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  export let ID = 0

  // query the dataset to get the DOI
  //////////////////////////////////////////
  const query = useQuery(
    ['donated_datasets.getById', ID],
    async () => await trpc(fetch).query('donated_datasets.getById', ID)
  )

  // save the DOI in a reactive variable
  $: DOI = $query.data?.DOI
</script>

<div class="">
  <span class="text-primary text-2xl font-semibold mr-2">DOI:</span>
  {#if DOI != null}
    <span class="text-2xl">{DOI}</span>
  {:else}
    <span class="text-2xl">N/A</span>
  {/if}
</div>

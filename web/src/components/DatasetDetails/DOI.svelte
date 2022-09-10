<script lang="ts">
  export let ID = 0

  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  const datasetQuery = useQuery(
    ['donated_datasets.getById', ID],
    async () => await trpc(fetch).query('donated_datasets.getById', ID)
  )

  $: DOI = $datasetQuery.data?.DOI
</script>

<div class="">
  <span class="text-primary text-2xl font-semibold mr-2">DOI:</span>
  {#if DOI != null}
    <span class="text-2xl">{DOI}</span>
  {:else}
    <span class="text-2xl">N/A</span>
  {/if}
</div>

<script lang="ts">
  export let ID = 0
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  const keywordQuery = useQuery(
    ['keywords.getDatasetKeywords', ID],
    async () => await trpc(fetch).query('keywords.getDatasetKeywords', ID)
  )

  $: keywords = $keywordQuery.data || []
</script>

<div class="flex flex-col gap-4">
  <h1 class="text-primary text-2xl font-semibold">Keywords</h1>
  <div class="flex flex-wrap gap-3">
    {#if !keywords.length}
      <p class="text-xl">N/A</p>
    {:else}
      {#each keywords as keyword}
        <span class="badge badge-lg p-4">{keyword.keywords.keyword}</span>
      {/each}
    {/if}
  </div>
</div>

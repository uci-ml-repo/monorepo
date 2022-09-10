<script lang="ts">
  export let ID = 0

  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  // search results
  //////////////////////////////////////////
  const query = useQuery(
    ['donated_datasets.byId', ID],
    async () => await trpc(fetch).query('donated_datasets.getById', ID)
  )

  $: URLLink = $query?.data?.URLLink
</script>

<!-- flex columns wraps around the title and the content to apply a gap-->
<div class="flex flex-col gap-3">
  <!-- title -->
  <h1 class="text-primary text-2xl font-semibold">License</h1>

  <!-- license text -->
  <div>
    {#if URLLink}
      <span>Go to linked dataset for licensing information</span>
    {:else}
      <span>
        This dataset is licensed under a{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/legalcode">
          Creative Commons Attribution 4.0 International
        </a>
        (CC BY 4.0) license.
      </span>
      <br />
      <br />
      <span>
        This allows for the sharing and adaptation of the datasets for any purpose, provided
        that the appropriate credit is given.
      </span>
    {/if}
  </div>
</div>

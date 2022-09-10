<script lang="ts">
  export let ID = 0
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'
  import PersonIcon from '$components/Icons/Person.svelte'

  const creatorQuery = useQuery(
    ['creators.getByDatasetId', ID],
    async () => await trpc(fetch).query('creators.getByDatasetId', ID)
  )

  $: creators = $creatorQuery.data || []
</script>

<div class="flex flex-col gap-4">
  <h1 class="text-primary text-2xl font-semibold">Creators</h1>
  <div class="flex flex-col gap-4">
    {#if !creators.length}
      <p class="text-xl">N/A</p>
    {:else}
      {#each creators as creator}
        <div class="flex items-center gap-4 text-md">
          <PersonIcon class="h-8 fill-primary" />
          <div class="flex flex-col">
            <p class="text-lg">{creator.firstName} {creator.lastName}</p>
            {#if creator.email}
              <p>{creator.email}</p>
            {/if}
            {#if creator.institution}
              <p>{creator.institution}</p>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

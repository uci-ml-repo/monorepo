<script lang="ts">
  export let ID = 0

  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  const notesQuery = useQuery(
    ['notes.getByDatasetId', ID],
    async () => await trpc(fetch).query('notes.getByDatasetId', ID)
  )

  $: notes = $notesQuery.data
</script>

<div>
  <h1 class="text-primary text-2xl font-semibold">Notes</h1>
  {#if notes}
    <p class="text-xl">{notes}</p>
  {:else}
    <p class="text-xl">N/A</p>
  {/if}
</div>

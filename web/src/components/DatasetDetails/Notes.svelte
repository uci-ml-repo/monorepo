<script lang="ts">
  export let ID = 0

  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import PencilIcon from '$components/Icons/Pencil.svelte'

  const notesQuery = useQuery(
    ['notes.getByDatasetId', ID],
    async () => await trpc(fetch).query('notes.getByDatasetId', ID)
  )

  $: notes = $notesQuery.data
</script>

<div class="flex flex-col gap-2">
  <div class="flex gap-4 items-center">
    <h1 class="text-primary text-2xl font-semibold">Notes</h1>
    <button class="btn btn-ghost btn-circle btn-sm fill-accent">
      <PencilIcon />
    </button>
  </div>
  {#if notes}
    <p>{notes}</p>
  {:else}
    <p class="text-xl">N/A</p>
  {/if}
</div>

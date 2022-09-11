<script lang="ts">
  export let ID = 0

  import { clickOutside } from '$lib/actions'

  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import PencilIcon from '$components/Icons/Pencil.svelte'
  import XIcon from '$components/Icons/X.svelte'

  const notesQuery = useQuery(
    ['notes.getByDatasetId', ID],
    async () => await trpc(fetch).query('notes.getByDatasetId', ID)
  )

  $: notes = $notesQuery.data

  let noteEditOpen = false

  const openNoteEdit = () => (noteEditOpen = true)
  const closeNoteEdit = () => (noteEditOpen = false)
</script>

<div class="flex flex-col gap-2">
  <div class="flex gap-4 items-center">
    <h1 class="text-primary text-2xl font-semibold">Notes</h1>
    {#if noteEditOpen}
      <button class="btn btn-error btn-circle btn-sm fill-accent" on:click={closeNoteEdit}>
        <XIcon />
      </button>
    {:else}
      <button class="btn btn-ghost btn-circle btn-sm fill-accent" on:click={openNoteEdit}>
        <PencilIcon />
      </button>
    {/if}
  </div>
  {#if notes}
    <p>{notes}</p>
  {:else}
    <p class="text-xl">N/A</p>
  {/if}
</div>

<div class="modal" class:modal-open={noteEditOpen}>
  <div class="modal-box" use:clickOutside on:outside_click={closeNoteEdit}>Edit Notes</div>
</div>

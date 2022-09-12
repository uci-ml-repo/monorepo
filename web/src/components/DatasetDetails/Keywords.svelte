<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'

  import { clickOutside } from '$lib/actions'
  import trpc from '$lib/trpc'

  import PencilIcon from '$components/Icons/Pencil.svelte'

  import KeywordsEdit from '$components/DatasetEdit/Keywords.svelte'

  export let ID = 0

  // setup the existing keywords (displayed in UI and remove keywords form)
  // and all keywords (add new keywords form)
  //////////////////////////////////////////
  const query = useQuery(
    ['keywords.getDatasetKeywords', ID],
    async () => await trpc(fetch).query('keywords.getDatasetKeywords', ID)
  )

  // existing keywords for UI
  $: keywords = $query.data || []

  // modal controls
  //////////////////////////////////////////
  let modalOpen = false

  const closeModal = () => (modalOpen = false)
  const openModal = () => (modalOpen = true)
</script>

<div class="flex flex-col gap-4">
  <div class="flex gap-4 items-center">
    <!-- title -->
    <h1 class="text-primary text-2xl font-semibold">Keywords</h1>

    <!-- edit button to open the edit keywords modal  -->
    <button on:click={openModal} class="btn btn-ghost btn-circle btn-sm fill-accent">
      <PencilIcon />
    </button>
  </div>

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

<!-- edit keywords modal -->
<div class="modal" class:modal-open={modalOpen}>
  <div
    class="modal-box overflow-visible flex flex-col gap-4"
    use:clickOutside
    on:outside_click={closeModal}
  >
    <KeywordsEdit {ID}>
      <div>
        <button type="submit" class="btn btn-primary" on:click={closeModal}>Submit</button>
        <button
          type="button"
          class="btn btn-primary btn-error btn-outline"
          on:click={closeModal}>Cancel</button
        >
      </div>
    </KeywordsEdit>
  </div>
</div>

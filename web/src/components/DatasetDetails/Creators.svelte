<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'

  import { clickOutside } from '$lib/actions'
  import trpc from '$lib/trpc'

  import PersonIcon from '$components/Icons/Person.svelte'
  import PencilIcon from '$components/Icons/Pencil.svelte'

  import CreatorsEdit from '$components/DatasetEdit/Creators.svelte'

  export let ID = 0

  // get creators for this dataset
  //////////////////////////////////////////
  const creatorQuery = useQuery(
    ['creators.getByDatasetId', ID],
    async () => await trpc(fetch).query('creators.getByDatasetId', ID)
  )

  $: creators = $creatorQuery.data || []

  // modal controls
  //////////////////////////////////////////
  let modalOpen = false
  const closeModal = () => (modalOpen = false)
  const openModal = () => (modalOpen = true)
</script>

<div>
  <!-- visible UI on the sidebar -->
  <div class="flex flex-col gap-4">
    <!-- title area: header and edit icon to open creator edit modal -->
    <div class="flex gap-4 items-center">
      <h1 class="text-primary text-2xl font-semibold">Creators</h1>
      <button class="btn btn-ghost btn-circle btn-sm fill-accent" on:click={openModal}>
        <PencilIcon />
      </button>
    </div>

    <!-- map each existing creator to an icon and their information -->
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

  <!-- creators edit form in a modal -->
  <div class="modal" class:modal-open={modalOpen}>
    <div class="modal-box relative" use:clickOutside on:outside_click={closeModal}>
      <CreatorsEdit {ID}>
        <div class="flex gap-4">
          <button type="submit" class="btn btn-primary">Submit</button>
          <button type="button" class="btn btn-error btn-outline" on:click={closeModal}
            >Cancel</button
          >
        </div>
      </CreatorsEdit>
    </div>
  </div>
</div>

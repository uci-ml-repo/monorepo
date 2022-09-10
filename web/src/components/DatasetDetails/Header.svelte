<script lang="ts">
  import trpc from '$lib/trpc'
  import { clickOutside } from '$lib/actions'
  import { useQuery } from '@sveltestack/svelte-query'
  import type { donated_datasets } from '@prisma/client'

  import DropdownText from '$components/DropdownText.svelte'

  import CaretIcon from '$components/Icons/Caret.svelte'
  import PencilIcon from '$components/Icons/Pencil.svelte'
  import XIcon from '$components/Icons/X.svelte'

  export let ID = 0

  // search results
  //////////////////////////////////////////
  const query = useQuery(
    ['donated_datasets.byId', ID],
    async () => await trpc(fetch).query('donated_datasets.getById', ID)
  )

  $: dataset = $query.data
  $: date = new Date(dataset?.DateDonated || '').toLocaleDateString('en')

  // image src for the dataset avatar
  $: src =
    dataset?.Graphics != null
      ? '/ml/datasets/' + dataset.ID + '/Graphics/Large.jpg'
      : '/ml/datasets/default/Large.jpg'

  // assert that dataset is defined and non-null, I'm not sure of a better way to do this
  const metadata: { label: string; key: keyof donated_datasets }[] = [
    {
      label: 'Dataset Characteristics',
      key: 'Types',
    },
    {
      label: 'Subject Area',
      key: 'Area',
    },
    {
      label: 'Associated Tasks',
      key: 'Task',
    },
    {
      label: 'Attribute Type',
      key: 'AttributeTypes',
    },
    {
      label: '# Instances',
      key: 'NumInstances',
    },
    {
      label: '# Attributes',
      key: 'NumAttributes',
    },
  ]

  // dataset edit controls (e.g. change graphics and delete)
  //////////////////////////////////////////
  let datasetEditOpen = false

  const closeDatasetEdit = () => (datasetEditOpen = false)
  const openDatasetEdit = () => (datasetEditOpen = true)

  // metadata edit controls (e.g. abstract, types)
  //////////////////////////////////////////
  let metadataEditOpen = false

  const closeMetadataEdit = () => (metadataEditOpen = false)
  const openMetadataEdit = () => (metadataEditOpen = true)
</script>

<div class="flex flex-col">
  <!-- top, blue part of the header -->
  <div class="w-full bg-primary flex p-2 flex items-center gap-4 relative">
    {#if datasetEditOpen}
      <button
        class="btn btn-sm btn-error btn-circle absolute top-2 right-2"
        on:click={closeDatasetEdit}
      >
        <XIcon />
      </button>
    {:else}
      <button
        class="btn btn-sm btn-ghost btn-circle absolute top-2 right-2"
        on:click={openDatasetEdit}
      >
        <PencilIcon class="fill-accent" />
      </button>
    {/if}
    <!-- avatar to the left of the header -->
    <div class="mask w-16 h-16 flex align-center">
      <img {src} alt="dataset-graphic-large-screen" />
    </div>

    <!-- title and date donated -->
    <div>
      <div class="flex items-center gap-4">
        <h1 class="text-2xl text-white font-semibold">{dataset?.Name}</h1>
        {#if dataset?.URLLink}
          <div class="badge badge-lg badge-secondary">External</div>
        {/if}
      </div>
      {#if dataset?.DateDonated != null}
        <h2 class="text-lg text-white">Donated on {date}</h2>
      {/if}
    </div>
  </div>

  <!-- bottom part of the header, abstract and metadata -->
  <div class="shadow bg-base-100 p-4 flex flex-col gap-4 relative">
    <!-- metadata editing pencil to the top right of the abstract -->
    {#if metadataEditOpen}
      <button
        class="btn btn-sm btn-error btn-outline btn-circle absolute top-2 right-2"
        on:click={closeMetadataEdit}
      >
        <XIcon />
      </button>
    {:else}
      <button
        class="btn btn-sm btn-ghost btn-circle absolute top-2 right-2"
        on:click={openMetadataEdit}
      >
        <PencilIcon class="fill-accent" />
      </button>
    {/if}
    {#if metadataEditOpen}
      <h1>editing</h1>
      <!-- metadata grid; will show editing form if it's open -->
    {:else}
      <div>
        <!-- abstract -->
        {#if dataset}
          <DropdownText>
            {dataset.Abstract}
            <button
              slot="button"
              class="btn btn-ghost w-full flex justify-center gap-6"
              let:open
              aria-label="show-abstract"
            >
              <CaretIcon {open} />
            </button>
          </DropdownText>
        {/if}
      </div>

      <div class="grid grid-cols-8 md:grid-cols-12 gap-4">
        {#each metadata as { label, key }}
          <div class="col-span-4">
            <h1 class="text-primary text-lg font-semibold">{label}</h1>
            <p class="text-md">{dataset?.[key] || 'N/A'}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<div class="modal" class:modal-open={datasetEditOpen}>
  <div class="modal-box" use:clickOutside on:outside_click={closeDatasetEdit}>
    Edit Dataset (delete or graphics)
  </div>
</div>

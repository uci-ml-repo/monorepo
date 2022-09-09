<script lang="ts">
  import { collapse } from '$lib/actions'
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'
  import type { donated_datasets } from '@prisma/client'

  export let ID = 0

  // search results
  //////////////////////////////////////////
  const query = useQuery(
    'donated_datasets.byId',
    async () => await trpc(fetch).query('donated_datasets.getById', ID)
  )

  $: dataset = $query.data
  $: date = new Date(dataset?.DateDonated || '').toLocaleDateString('en')

  // image src for the dataset avatar
  $: src =
    dataset?.Graphics != null
      ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
      : '/ml/datasets/default/SmallLarge.jpg'

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

  let open = false
</script>

<div class="flex flex-col">
  <!-- top, blue part of the header -->
  <div class="w-full base-primary flex p-2 flex items-center gap-4">
    <!-- avatar to the left of the header -->
    <div class="mask w-16 h-16 flex align-center">
      <img {src} alt="dataset-graphic-large-screen" />
    </div>

    <!-- title and date donated -->
    <div>
      <h1 class="text-2xl text-white">{dataset?.Name}</h1>
      {#if dataset?.DateDonated != null}
        <h2 class="text-lg text-white">Donated on {date}</h2>
      {/if}
    </div>
  </div>

  <!-- bottom part of the header, abstract and metadata -->
  <!-- #TODO: change this into an each/map function-->
  <div class="shadow bg-base-100 p-4 flex flex-col gap-4">
    <p use:collapse={{ open }}>{dataset?.Abstract}</p>

    <!-- metadata grid -->
    <div class="grid grid-cols-8 md:grid-cols-12 gap-4">
      {#each metadata as { label, key }}
        <div class="col-span-4">
          <h1 class="text-primary text-lg font-semibold">{label}</h1>
          <p class="text-md">{dataset?.[key] || 'N/A'}</p>
        </div>
      {/each}
    </div>
  </div>
</div>

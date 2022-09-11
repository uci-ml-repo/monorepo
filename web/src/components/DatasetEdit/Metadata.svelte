<script lang="ts">
  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'

  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import { MetadataSchema } from '$lib/schemas'
  import { z } from 'zod'

  const MetadataEditSchema = z.object({
    metadata: MetadataSchema,
    rationale: z.string(),
  })

  type MetadataEditFormData = z.TypeOf<typeof MetadataEditSchema>

  export let ID = 0

  // get all keywords from database for autocomplete
  const metadataQuery = useQuery(
    ['donated_datasets.getById', ID],
    async () => await trpc(fetch).query('donated_datasets.getById', ID)
  )

  $: data = $metadataQuery.data

  const { form, setData } = createForm<MetadataEditFormData>({
    initialValues: {
      metadata: {
        Abstract: data?.Abstract,
        Types: data?.Types?.split(', ') || [],
        Area: data?.Area || '',
        DOI: data?.DOI,
        Task: data?.Task?.split(', ') || [],
      },
    },
    extend: [validator({ schema: MetadataEditSchema }), reporter],
  })

  // enumerated form fields
  //////////////////////////////////////////
  const Areas = [
    'Business',
    'Computer Science',
    'Engineering',
    'Game',
    'Law',
    'Life Science',
    'Physical Science',
    'Social Science',
    'Other',
  ]

  const Types = [
    'Tabular',
    'Sequential',
    'Multivariate',
    'Time-Series',
    'Text',
    'Image',
    'Other',
  ]

  const Tasks = ['Classification', 'Regression', 'Clustering', 'Other']

  let hasDOI = 'No'
</script>

<form use:form class="flex flex-col gap-4 w-full">
  <div class="flex items-center gap-2px-0">
    <h1 class="text-primary text-3xl">Metadata*</h1>
  </div>

  <div class="flex flex-col gap-6">
    <div class="flex flex-col">
      <div class="flex items-center gap-3">
        <label for="dataset-name" class="text-xl">Dataset Name*</label>
      </div>
      <input
        id="dataset-name"
        name="metadata.Name"
        type="text"
        class="input input-bordered mt-2 w-full"
        placeholder="Dataset Name"
        required
      />
    </div>

    <div class="divider" />

    <div class="flex flex-col gap-2">
      <label for="metadata.Abstract" class="text-xl">Abstract*</label>
      <input
        id="metadata.Abstract"
        name="metadata.Abstract"
        type="text"
        class="input input-bordered"
        placeholder="Abstract"
        required
      />
    </div>

    <div class="divider" />

    <div class="flex flex-col gap-2">
      <label for="area-radio" class="text-xl">Areas*</label>
      <div id="area-radio" class="form-control flex gap-4 max-w-sm">
        {#each Areas as Area}
          <label class="label cursor-pointer flex gap-3">
            <span class="label-text text-md">{Area}</span>
            <input
              type="radio"
              name="metadata.Area"
              value={Area}
              class="radio radio-primary"
            />
          </label>
        {/each}
      </div>
    </div>

    <div class="divider" />

    <div class="flex flex-col gap-2">
      <label for="types-checkbox" class="text-xl">Types*</label>
      <div id="types-checkbox" class="flex gap-2 form-control max-w-sm">
        {#each Types as Type}
          <label class="label cursor-pointer">
            <span class="label-text text-md">{Type}</span>
            <input
              type="checkbox"
              name="metadata.Types"
              value={Type}
              class="checkbox checkbox-primary"
            />
          </label>
        {/each}
      </div>
    </div>

    <div class="divider" />

    <div class="flex flex-col gap-2">
      <label for="metadata.DOI" class="text-xl">DOI*</label>
      <div id="DOI-radio" class="flex gap-2 form-control max-w-sm">
        <label class="label cursor-pointer">
          <span class="label-text text-md">Yes</span>
          <input
            type="radio"
            class="radio radio-primary"
            on:change={() => setData('metadata.DOI', '')}
            bind:group={hasDOI}
            value="Yes"
          />
        </label>
        <label class="label cursor-pointer">
          <span class="label-text text-md">No</span>
          <input
            type="radio"
            class="radio radio-primary"
            on:change={() => setData('metadata.DOI', null)}
            bind:group={hasDOI}
            value="No"
          />
        </label>
      </div>
      <input
        id="metadata.DOI"
        name="metadata.DOI"
        type="text"
        class="input input-bordered"
        class:hidden={hasDOI === 'No'}
      />
    </div>

    <div class="divider" />
    <div class="flex flex-col gap-2">
      <label for="task-checkbox" class="text-xl">Task*</label>
      <div id="task-checkbox" class="flex gap-2 form-control max-w-sm">
        {#each Tasks as Task}
          <label class="label cursor-pointer">
            <span class="label-text text-md">{Task}</span>
            <input
              type="checkbox"
              name="metadata.Task"
              value={Task}
              class="checkbox checkbox-primary"
            />
          </label>
        {/each}
      </div>
    </div>
  </div>
  <label for="metadata-edit-rationale" class="flex flex-col gap-4">
    <span class="text-lg">Rationale (optional)</span>
    <input type="text" name="rationale" class="input input-bordered" />
  </label>

  <slot />
</form>

<script lang="ts">
  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { z } from 'zod'

  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import { MetadataSchema } from '$lib/schemas'

  import MetadataFields from '$components/FormFields/Metadata.svelte'

  export let ID = 0
  export let name = 'metadata.'
  export let onSubmit = (data: MetadataEditFormData) => console.log(data)

  // get existing metadata for dataset
  //////////////////////////////////////////
  const metadataQuery = useQuery(
    ['donated_datasets.getById', ID],
    async () => await trpc(fetch).query('donated_datasets.getById', ID)
  )

  $: metadata = $metadataQuery.data

  // this will be false until the form has initialized with the previous data
  let hasInitialized = false

  // initialize form
  //////////////////////////////////////////
  const MetadataEditSchema = z.object({
    metadata: MetadataSchema,
    rationale: z.string().optional(),
  })

  type MetadataEditFormData = z.TypeOf<typeof MetadataEditSchema>

  const { form, data, isDirty, setData, setInitialValues } = createForm<MetadataEditFormData>({
    initialValues: {
      metadata: {
        Abstract: metadata?.Abstract,
        Types: metadata?.Types?.split(', ') || [],
        Area: metadata?.Area || '',
        DOI: metadata?.DOI,
        Task: metadata?.Task?.split(', ') || [],
      },
    },
    extend: [validator({ schema: MetadataEditSchema }), reporter],
    onSubmit,
  })

  // if form hasn't been touched and metadata has been updated, reset the initial values
  // redundant check for metadata as null type guard for TypeScript
  $: if (!$isDirty && metadata) {
    setInitialValues({
      metadata: {
        Abstract: metadata?.Abstract,
        Types: metadata?.Types?.split(', ') || [],
        Area: metadata?.Area || '',
        DOI: metadata?.DOI,
        Task: metadata?.Task?.split(', ') || [],
      },
    })
    hasInitialized = true
  }

  $: hasDOI = $data.metadata.DOI == null ? 'No' : 'Yes'
</script>

<!-- re-mount the component whenever metadata changes state -->
{#key hasInitialized}
  <form use:form class="flex flex-col gap-4 w-full">
    <!-- header -->
    <div class="flex items-center gap-2px-0">
      <h1 class="text-primary text-3xl">Metadata*</h1>
    </div>

    <MetadataFields {hasDOI} {setData} {name} />

    <!-- rationale -->
    <label for="metadata-edit-rationale" class="flex flex-col gap-4">
      <span class="text-lg">Rationale (optional)</span>
      <input type="text" name="rationale" class="input input-bordered" />
    </label>

    <slot />
  </form>
{/key}

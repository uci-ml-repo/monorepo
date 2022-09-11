<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'

  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { createForm } from 'felte'
  import { z } from 'zod'

  import trpc from '$lib/trpc'

  import Autocompletev2 from '$components/Autocompletev2.svelte'
  import Tabs from '$components/Tabs.svelte'

  export let ID = 0

  // initialize form schemas and types
  //////////////////////////////////////////
  const AddKeywordSchema = z.object({
    keywords: z.string().array(),
    rationale: z.string(),
  })

  const RemoveKeywordSchema = z.object({
    keywords: z.number().array(),
    rationale: z.string(),
  })

  type AddKeywordFormData = z.TypeOf<typeof AddKeywordSchema>
  type RemoveKeywordFormData = z.TypeOf<typeof RemoveKeywordSchema>

  // initialize forms
  //////////////////////////////////////////

  // add keyword by string form
  const { form: addKeywordForm, data: addKeywordData } = createForm<AddKeywordFormData>({
    initialValues: {
      keywords: [],
    },
    extend: [validator({ schema: AddKeywordSchema }), reporter],
    onSubmit: (data) => {
      console.log(data)
    },
  })

  // remove keyword by ID form
  const { form: removeKeywordForm, data: removeKeywordData } =
    createForm<RemoveKeywordFormData>({
      initialValues: {
        keywords: [],
      },
      extend: [validator({ schema: RemoveKeywordSchema }), reporter],
      onSubmit: (data) => {
        console.log(data)
      },
    })

  // setup the existing keywords (displayed in UI and remove keywords form)
  // and all keywords (add new keywords form)
  //////////////////////////////////////////
  const existingKeywordQuery = useQuery(
    ['keywords.getDatasetKeywords', ID],
    async () => await trpc(fetch).query('keywords.getDatasetKeywords', ID)
  )

  const allKeywordQuery = useQuery(
    ['keywords.getNames'],
    async () => await trpc(fetch).query('keywords.getNames')
  )

  // keyword options for autocomplete
  $: allKeywordOptions = $allKeywordQuery?.data || []

  // existing keywords needs to be array { label, value } objects
  // where the label is displayed, but the form data collects the value (keyword ID)
  $: existingKeywordOptions =
    $existingKeywordQuery?.data?.map((k) => ({
      label: k.keywords.keyword,
      value: k.keywordsID,
    })) || []

  // tab controls
  //////////////////////////////////////////
  const options = [
    { label: 'Add Keywords', value: 'add' },
    { label: 'Remove Keywords', value: 'remove' },
  ]

  let formType = 'add'
</script>

<div>
  <Tabs {options} bind:value={formType} />

  <!-- autocomplete with multiple options if adding a keyword -->
  {#if formType === 'add'}
    <form use:addKeywordForm class="flex flex-col gap-4">
      <label for="keyword-add-autocomplete">
        <span class="text-lg">Keywords to Add</span>
        <Autocompletev2
          bind:selectedValues={$addKeywordData.keywords}
          options={allKeywordOptions}
          multiple
          freeSolo
        />
      </label>
      <div class="flex flex-col gap-4 mt-auto">
        <label for="keyword-add-rationale">
          <span class="text-lg">Rationale (optional)</span>
          <input
            type="text"
            name="rationale"
            class="input input-bordered w-full"
            placeholder="Rationale (optional)"
          />
        </label>

        <!-- parent component can slot in form controls -->
        <slot />
      </div>
    </form>
  {/if}

  {#if formType === 'remove'}
    <form use:removeKeywordForm class="flex flex-col gap-4">
      <label for="keyword-remove-autocomplete">
        <span class="text-lg">Keywords to Remove</span>
        <Autocompletev2
          bind:selectedValues={$removeKeywordData.keywords}
          options={existingKeywordOptions}
          multiple
        />
      </label>
      <label for="keyword-remove-rationale">
        <span class="text-lg">Rationale (optional)</span>
        <input
          type="text"
          name="rationale"
          class="input input-bordered w-full"
          placeholder="Rationale (optional)"
        />
      </label>

      <!-- parent component can slot in form controls -->
      <slot />
    </form>
  {/if}
</div>

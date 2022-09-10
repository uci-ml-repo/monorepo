<script lang="ts">
  export let ID = 0
  import { useQuery } from '@sveltestack/svelte-query'
  import Autocompletev2 from '$components/Autocompletev2.svelte'
  import Tabs from '$components/Tabs.svelte'

  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { createForm } from 'felte'
  import { z } from 'zod'

  import { clickOutside } from '$lib/actions'
  import trpc from '$lib/trpc'

  import PencilIcon from '$components/Icons/Pencil.svelte'

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
  const { form: addKeywordForm, data: addKeywordData } = createForm<AddKeywordFormData>({
    initialValues: {
      keywords: [],
    },
    extend: [validator({ schema: AddKeywordSchema }), reporter],
    onSubmit: (data) => {
      console.log(data)
    },
  })

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
  //and all keywords (add new keywords form)
  //////////////////////////////////////////
  const existingKeywordQuery = useQuery(
    ['keywords.getDatasetKeywords', ID],
    async () => await trpc(fetch).query('keywords.getDatasetKeywords', ID)
  )

  const allKeywordQuery = useQuery(
    ['keywords.getNames'],
    async () => await trpc(fetch).query('keywords.getNames')
  )

  // existing keywords for UI
  $: existingKeywords = $existingKeywordQuery.data || []

  // keyword options for autocomplete
  $: allKeywordOptions = $allKeywordQuery?.data || []

  // existing keywords needs to be array { label, value } objects
  // where the label is displayed, but the form data collects the value (keyword ID)
  $: existingKeywordOptions =
    $existingKeywordQuery?.data?.map((k) => ({
      label: k.keywords.keyword,
      value: k.keywordsID,
    })) || []

  // modal controls
  //////////////////////////////////////////
  let modalOpen = false

  const closeModal = () => {
    modalOpen = false
  }

  const openModal = () => {
    modalOpen = true
  }

  const options = [
    { label: 'Add Keywords', value: 'add' },
    { label: 'Remove Keywords', value: 'remove' },
  ]

  let formType = 'add'
</script>

<div class="flex flex-col gap-4">
  <div class="flex gap-4 items-center">
    <h1 class="text-primary text-2xl font-semibold">Keywords</h1>
    <button on:click={openModal} class="btn btn-ghost btn-circle btn-sm fill-accent">
      <PencilIcon />
    </button>
  </div>
  <div class="flex flex-wrap gap-3">
    {#if !existingKeywords.length}
      <p class="text-xl">N/A</p>
    {:else}
      {#each existingKeywords as keyword}
        <span class="badge badge-lg p-4">{keyword.keywords.keyword}</span>
      {/each}
    {/if}
  </div>
</div>

<div class="modal" class:modal-open={modalOpen}>
  <div
    class="modal-box relative min-h-[500px] flex flex-col gap-4"
    use:clickOutside
    on:outside_click={closeModal}
  >
    <Tabs {options} bind:value={formType} />

    <!-- autocomplete with multiple options if adding a keyword -->
    {#if formType === 'add'}
      <form use:addKeywordForm class="flex flex-col gap-4">
        <Autocompletev2
          bind:selectedValues={$addKeywordData.keywords}
          options={allKeywordOptions}
          multiple
          freeSolo
        />
        <input type="text" name="rationale" class="input input-bordered w-full" />
        <div>
          <button type="submit" class="btn btn-primary">Submit</button>
          <button
            type="button"
            class="btn btn-primary btn-error btn-outline"
            on:click={closeModal}>Cancel</button
          >
        </div>
      </form>
    {/if}

    {#if formType === 'remove'}
      <form use:removeKeywordForm class="flex flex-col gap-4">
        <Autocompletev2
          bind:selectedValues={$removeKeywordData.keywords}
          options={existingKeywordOptions}
          multiple
        />
        <input type="text" name="rationale" class="input input-bordered w-full" />
        <div>
          <button type="submit" class="btn btn-primary">Submit</button>
          <button
            type="button"
            class="btn btn-primary btn-error btn-outline"
            on:click={closeModal}>Cancel</button
          >
        </div>
      </form>
    {/if}
  </div>
</div>

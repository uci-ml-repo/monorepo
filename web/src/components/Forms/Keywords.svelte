<script lang="ts">
  /*
     the keyword edit form uses the keyword add and keyword remove fields to collect
     keyword strings or IDs, and appends a rationale to the form data
     the parent can provide controls to the forms with the default slot
     (replicated for both forms)

     the parent can't bind to any values at the moment; the slot control
     is mainly for controlling what happens if the user e.g. cancels;
     a button with type 'submit' will trigger the forms' onSubmit procedure,
     which can be overridden with a prop (both share the same onSubmit prop for now)
   */

  import { queryClient } from '$lib/query'
  import { useMutation } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { createForm } from 'felte'
  import { z } from 'zod'

  import Tabs from '$components/UI/Tabs.svelte'
  import KeywordFieldArray from '$components/Fields/AddKeywords.svelte'
  import RemoveKeywords from '$components/Fields/RemoveKeywords.svelte'

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

  // mutation requests
  //////////////////////////////////////////

  // accept an edit if the person has authority
  const acceptMutation = useMutation(
    async (ID: number) => {
      return await trpc(fetch).mutation('edits.accept', ID)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['keywords.getDatasetKeywords', ID])
        queryClient.invalidateQueries(['keywords.getNames'])
      },
    }
  )

  // insert an edit
  const insertMutation = useMutation(
    async (data: AddKeywordFormData | RemoveKeywordFormData) => {
      return await trpc(fetch).mutation('edits.insert', {
        datasetID: ID,
        userID: 631,
        recordID: undefined,
        actionID: formType === 'add' ? 1 : 2,
        tableID: 3,
        data: data.keywords,
        oldData: '',
        rationale: data.rationale,
      })
    },
    {
      onSuccess: (data) => {
        addReset()
        removeReset()
        $acceptMutation.mutate(data.ID)
      },
    }
  )

  // initialize forms
  //////////////////////////////////////////

  // add keyword by string form
  const {
    form: addKeywordForm,
    data: addKeywordData,
    reset: addReset,
  } = createForm<AddKeywordFormData>({
    initialValues: {
      keywords: [],
    },
    extend: [validator({ schema: AddKeywordSchema }), reporter],
    onSubmit: (data) => {
      $insertMutation.mutate(data)
    },
  })

  // remove keyword by ID form
  const {
    form: removeKeywordForm,
    data: removeKeywordData,
    reset: removeReset,
  } = createForm<RemoveKeywordFormData>({
    initialValues: {
      keywords: [],
    },
    extend: [validator({ schema: RemoveKeywordSchema }), reporter],
    onSubmit: (data) => {
      $insertMutation.mutate(data)
    },
  })

  // tab controls
  //////////////////////////////////////////
  const options = [
    { label: 'Add Keywords', value: 'add' },
    { label: 'Remove Keywords', value: 'remove' },
  ]

  let formType = 'add'
</script>

<div class="flex flex-col gap-4">
  <!-- use tab navigation and allow it to control the form type -->
  <Tabs {options} bind:value={formType} />

  <!-- autocomplete with multiple options if adding a keyword -->
  {#if formType === 'add'}
    <form use:addKeywordForm class="flex flex-col gap-8">
      <!-- collect values from the keyword field array and bind to the form data -->
      <KeywordFieldArray bind:selectedValues={$addKeywordData.keywords} />

      <!-- rationale -->
      <div class="flex flex-col gap-8 mt-auto">
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
    <form use:removeKeywordForm class="flex flex-col gap-8">
      <!-- collect values from the remove keyword select and bind to the form data -->
      <RemoveKeywords bind:selectedValues={$removeKeywordData.keywords} {ID} />

      <!-- rationale -->
      <div class="flex flex-col gap-8 mt-auto">
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
      </div>
    </form>
  {/if}
</div>

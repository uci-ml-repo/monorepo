<script lang="ts">
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { createForm } from 'felte'
  import { z } from 'zod'

  import Tabs from '$components/Tabs.svelte'
  import KeywordFieldArray from '$components/FormFields/AddKeywords.svelte'
  import RemoveKeywords from '$components/FormFields/RemoveKeywords.svelte'

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

  // tab controls
  //////////////////////////////////////////
  const options = [
    { label: 'Add Keywords', value: 'add' },
    { label: 'Remove Keywords', value: 'remove' },
  ]

  let formType = 'add'
</script>

<div>
  <!-- use tab navigation and allow it to control the form type -->
  <Tabs {options} bind:value={formType} />

  <!-- autocomplete with multiple options if adding a keyword -->
  {#if formType === 'add'}
    <form use:addKeywordForm class="flex flex-col gap-4">
      <!-- collect values from the keyword field array and bind to the form data -->
      <KeywordFieldArray bind:selectedValues={$addKeywordData.keywords} />

      <!-- rationale -->
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
      <!-- collect values from the remove keyword select and bind to the form data -->
      <RemoveKeywords bind:selectedValues={$removeKeywordData.keywords} {ID} />

      <!-- rationale -->
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

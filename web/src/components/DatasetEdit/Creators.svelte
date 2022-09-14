<script lang="ts">
  /*
     the creator edit form uses the creator field array and a checkbox list
     to collect form data about creators to add/remove
     it appends rationale to the form data, and provides a slot for the parent
     component to add controls

     there are no bind-able props, but the parent can pass a custom onSubmit prop
     to override the form submission behavior
   */

  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { createForm } from 'felte'
  import { z } from 'zod'

  import { useMutation, useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import { defaultCreator } from '$lib/schemas/Creator'
  import CreatorSchema from '$lib/schemas/Creator'

  import CreatorFieldArray from '$components/FormFields/CreatorFieldArray.svelte'
  import Tabs from '$components/Tabs.svelte'
  import { queryClient } from '$lib/query'

  export let ID = 0

  // query all existing creators for this dataset
  const creatorQuery = useQuery(
    ['creators.getByDatasetId', ID],
    async () => await trpc(fetch).query('creators.getByDatasetId', ID)
  )

  // mutation requests
  //////////////////////////////////////////

  // accept an edit if the person has authority
  const acceptMutation = useMutation(
    async (ID: number) => {
      return await trpc(fetch).mutation('edits.accept', ID)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['creators.getByDatasetId', ID])
      },
    }
  )

  // insert an edit
  const insertMutation = useMutation(
    async (data: AddCreatorFormData | RemoveCreatorFormData) => {
      return await trpc(fetch).mutation('edits.insert', {
        datasetID: ID,
        userID: 631,
        recordID: undefined,
        actionID: formType === 'add' ? 1 : 2,
        tableID: 2,
        data: data.creators,
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

  // initialize form schemas and types
  //////////////////////////////////////////
  const AddCreatorSchema = z.object({
    creators: CreatorSchema.array(),
    rationale: z.string(),
  })

  const RemoveCreatorSchema = z.object({
    creators: z
      .string()
      .array()
      .transform((creators) => creators.map((c) => parseInt(c))),
    rationale: z.string(),
  })

  type AddCreatorFormData = z.TypeOf<typeof AddCreatorSchema>
  type RemoveCreatorFormData = z.TypeOf<typeof RemoveCreatorSchema>

  // initialize forms
  //////////////////////////////////////////

  // add creator form
  const {
    form: addCreatorForm,
    data: addCreatorData,
    reset: addReset,
    addField,
    unsetField,
  } = createForm<AddCreatorFormData>({
    initialValues: {
      creators: [defaultCreator],
    },
    extend: [validator({ schema: AddCreatorSchema }), reporter],
    onSubmit: (data) => $insertMutation.mutate(data),
  })

  // remove creator by ID form
  const { form: removeCreatorForm, reset: removeReset } = createForm<RemoveCreatorFormData>({
    initialValues: {
      creators: [],
    },
    extend: [validator({ schema: RemoveCreatorSchema }), reporter],
    onSubmit: (data) => {
      // felte isn't able to accept transformed data from the schema yet, so transform it here
      //console.log(data.creators.map((creatorID) => parseInt(creatorID)))
      const creatorIDs = data.creators.map((c) => parseInt(c.toString()))
      const newData = { creators: creatorIDs, rationale: data.rationale }
      $insertMutation.mutate(newData)
    },
  })

  // keep track of all the new creators added
  $: newCreators = $addCreatorData.creators || []

  // keep track of the existing creators for the creator remove by ID
  $: existingCreators = $creatorQuery.data || []

  // field array controls
  //////////////////////////////////////////
  function removeCreator(index: number) {
    return unsetField(`creators.${index}`)
  }

  // add a new creator at the bottom of the field array
  function addNewCreator() {
    addField('creators', defaultCreator, newCreators.length || 0)
  }

  // form and modal controls
  //////////////////////////////////////////
  let formType = 'add'
  const options = [
    { label: 'Add Creators', value: 'add' },
    { label: 'Remove Creators', value: 'remove' },
  ]
</script>

<div class="flex flex-col gap-8">
  <!-- bind formType to the selected tabs value -->
  <Tabs {options} bind:value={formType} class="flex justify-center font-bold" />

  <!-- form for adding creators -->
  {#if formType === 'add'}
    <form use:addCreatorForm>
      <div class="flex flex-col gap-0">
        <!-- let the creator field array bind to the creators property in the form data -->
        <CreatorFieldArray
          bind:creators={$addCreatorData.creators}
          {removeCreator}
          {addNewCreator}
        />
      </div>

      <!-- actions area -->
      <div class="flex flex-col gap-4">
        <!-- rationale label and input -->
        <label for="creator-rationale" class="flex flex-col gap-4">
          <span class="text-xl">Rationale</span>
          <input
            type="text"
            name="rationale"
            class="input input-bordered w-full"
            placeholder="Rationale (optional)"
          />
        </label>

        <!-- parent component can insert button controls -->
        <!-- default slot will show up twice -->
        <slot />
      </div>
    </form>
  {/if}

  <!-- form for removing creators -->
  {#if formType === 'remove'}
    <form use:removeCreatorForm>
      <!-- remove creators checkboxes -->
      {#each existingCreators as creator}
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text text-lg">{creator.firstName} {creator.lastName}</span>
            <input
              type="checkbox"
              name="creators"
              value={creator.ID}
              class="checkbox checkbox-primary"
            />
          </label>
        </div>
      {/each}
      <div class="divider" />

      <!-- actions area -->
      <div class="flex flex-col gap-4">
        <!-- rationale label and input -->
        <label for="creator-rationale" class="flex flex-col gap-4">
          <span class="text-xl">Rationale</span>
          <input
            type="text"
            name="rationale"
            class="input input-bordered w-full"
            placeholder="Rationale (optional)"
          />
        </label>

        <!-- parent component can insert button controls -->
        <slot />
      </div>
    </form>
  {/if}
</div>

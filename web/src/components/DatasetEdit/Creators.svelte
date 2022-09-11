<script lang="ts">
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { createForm } from 'felte'
  import { z } from 'zod'

  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import { defaultCreator } from '$lib/schemas/Creator'
  import CreatorSchema from '$lib/schemas/Creator'

  import CreatorFieldArray from '$components/CustomFormFields/CreatorFieldArray.svelte'
  import PlusIcon from '$components/Icons/Plus.svelte'
  import Tabs from '$components/Tabs.svelte'

  export let ID = 0

  // query all existing creators for this dataset
  const creatorQuery = useQuery(
    ['creators.getByDatasetId', ID],
    async () => await trpc(fetch).query('creators.getByDatasetId', ID)
  )

  // initialize form schemas and types
  //////////////////////////////////////////
  const AddCreatorSchema = z.object({
    creators: CreatorSchema.array(),
    rationale: z.string(),
  })

  const RemoveCreatorSchema = z.object({
    creators: z.string().array(),
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
    addField,
    unsetField,
  } = createForm<AddCreatorFormData>({
    initialValues: {
      creators: [defaultCreator],
    },
    extend: [validator({ schema: AddCreatorSchema }), reporter],
    onSubmit: (data) => console.log(data),
  })

  // remove creator by ID form
  const { form: removeCreatorForm } = createForm<RemoveCreatorFormData>({
    initialValues: {
      creators: [],
    },
    extend: [validator({ schema: RemoveCreatorSchema }), reporter],
    onSubmit: (data) => {
      // felte isn't able to accept transformed data from the schema yet, so transform it here
      //console.log(data.creators.map((creatorID) => parseInt(creatorID)))
      console.log(data)
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
  export function addNewCreator() {
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
        {#each newCreators as creator, index}
          <CreatorFieldArray {index} bind:creator {removeCreator} />
          <div class="divider" />
        {/each}
        <button
          class="btn btn-primary w-50 mx-auto flex gap-2"
          on:click|preventDefault={addNewCreator}
        >
          <span>
            {newCreators?.length ? 'Add More Creators' : 'Begin Adding Creators'}
          </span>
          <PlusIcon class="fill-white" />
        </button>
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

<script lang="ts">
  export let ID = 0

  import { useQuery } from '@sveltestack/svelte-query'

  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { createForm } from 'felte'
  import { z } from 'zod'

  import { defaultCreator } from '$lib/schemas/Creator'
  import CreatorSchema from '$lib/schemas/Creator'
  import { clickOutside } from '$lib/actions'
  import trpc from '$lib/trpc'

  import CreatorFieldArray from '$components/CustomFormFields/CreatorFieldArray.svelte'
  import PersonIcon from '$components/Icons/Person.svelte'
  import PencilIcon from '$components/Icons/Pencil.svelte'
  import PlusIcon from '$components/Icons/Plus.svelte'
  import Tabs from '$components/Tabs.svelte'

  // initialize form schemas and types
  //////////////////////////////////////////
  const AddCreatorSchema = z.object({
    creators: CreatorSchema.array(),
    rationale: z.string(),
  })

  // convert the string array of creator IDs to numbers
  const RemoveCreatorSchema = z.object({
    creators: z.string().array(),
    rationale: z.string(),
  })

  type AddCreatorFormData = z.TypeOf<typeof AddCreatorSchema>
  type RemoveCreatorFormData = z.TypeOf<typeof RemoveCreatorSchema>

  // initialize forms
  //////////////////////////////////////////
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

  // keep track of all the new creators added
  $: newCreators = $addCreatorData.creators || []

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

  // field array controls
  //////////////////////////////////////////
  function removeCreator(index: number) {
    return unsetField(`creators.${index}`)
  }

  // add a new creator at the bottom of the field array
  export function addNewCreator() {
    addField('creators', defaultCreator, newCreators.length || 0)
  }

  // get all existing creators for the UI
  const creatorQuery = useQuery(
    ['creators.getByDatasetId', ID],
    async () => await trpc(fetch).query('creators.getByDatasetId', ID)
  )
  $: existingCreators = $creatorQuery.data || []

  // form and modal controls
  //////////////////////////////////////////
  let formType = 'add'
  const options = [
    { label: 'Add Creators', value: 'add' },
    { label: 'Remove Creators', value: 'remove' },
  ]

  let modalOpen = false

  const closeModal = () => {
    modalOpen = false
  }

  const openModal = () => {
    modalOpen = true
  }
</script>

<div>
  <!-- visible UI on the sidebar -->
  <div class="flex flex-col gap-4">
    <!-- title area: header and edit icon -->
    <div class="flex gap-4 items-center">
      <h1 class="text-primary text-2xl font-semibold">Creators</h1>
      <button class="btn btn-ghost btn-circle btn-sm fill-accent" on:click={openModal}>
        <PencilIcon />
      </button>
    </div>

    <!-- map each existing creator to an icon and their information -->
    <div class="flex flex-col gap-4">
      {#if !existingCreators.length}
        <p class="text-xl">N/A</p>
      {:else}
        {#each existingCreators as creator}
          <div class="flex items-center gap-4 text-md">
            <PersonIcon class="h-8 fill-primary" />
            <div class="flex flex-col">
              <p class="text-lg">{creator.firstName} {creator.lastName}</p>
              {#if creator.email}
                <p>{creator.email}</p>
              {/if}
              {#if creator.institution}
                <p>{creator.institution}</p>
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <div class="modal" class:modal-open={modalOpen}>
    <div class="modal-box relative" use:clickOutside on:outside_click={closeModal}>
      <!-- bind formType to the selected tabs value -->
      <Tabs {options} bind:value={formType} class="flex justify-center font-bold" />

      <div class="divider m-2" />

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

            <!-- buttons -->
            <div class="flex gap-4">
              <button type="submit" class="btn btn-primary">Submit</button>
              <button type="button" class="btn btn-error btn-outline" on:click={closeModal}
                >Cancel</button
              >
            </div>
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

            <!-- buttons -->
            <div class="flex gap-4">
              <button type="submit" class="btn btn-primary">Submit</button>
              <button type="button" class="btn btn-error btn-outline" on:click={closeModal}
                >Cancel</button
              >
            </div>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>

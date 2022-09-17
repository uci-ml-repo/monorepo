<script lang="ts">
  // props from parent form component
  //////////////////////////////////////////
  export let onSubmit: (formData: BasicInfoFormData) => void
  export let onBack: null | ((formData: any) => void) = null

  // imports
  //////////////////////////////////////////
  import { createForm } from 'felte'
  import { reporter, ValidationMessage } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'

  import { donationFormData } from '$lib/stores'

  import { defaultCreator } from '$lib/schemas/Creator'
  import { BasicInfoFormSchema } from '$lib/schemas/Donation'
  import type { BasicInfoFormData } from '$lib/schemas/Donation'

  import MetadataFields from '$components/Fields/Metadata.svelte'
  import SingleCreatorInput from '$components/Fields/SingleCreatorInput.svelte'
  import CreatorFieldArray from '$components/Fields/CreatorFieldArray.svelte'
  import AddKeywords from '$components/Fields/AddKeywords.svelte'

  // initialize form
  //////////////////////////////////////////
  const currentUser = {
    firstName: 'Elysia',
    lastName: 'Ego',
    email: null,
    address: 'Elysian Realm',
    institution: 'Flamechasers',
  }

  // initialize this form with the values from the store
  const { form, data, setData, addField, unsetField } = createForm<BasicInfoFormData>({
    initialValues: {
      metadata: $donationFormData.metadata,
      creator: $donationFormData.creator,
      keywords: $donationFormData.keywords,
      creators: $donationFormData.creators,
    },
    extend: [validator({ schema: BasicInfoFormSchema }), reporter],
    onSubmit,
  })

  $: creators = $data.creators

  let creatorIsDonor = 'Yes'

  // field array controls
  //////////////////////////////////////////
  // add a new creator at the bottom of the field array
  function removeCreator(index: number) {
    return unsetField(`creators.${index}`)
  }

  // add a new creator at the bottom of the field array
  function addNewCreator() {
    addField('creators', defaultCreator, creators.length || 0)
  }
</script>

<div class="max-w-4xl mx-auto">
  <form use:form class="flex flex-col gap-8">
    <!-- metadata fields-->
    <div>
      <h1 class="text-primary text-3xl">Metadata*</h1>

      <!-- augment the regular metadata form field with a dataset name input-->
      <label for="metadata.Name" class="flex flex-col gap-4 my-4">
        <span class="text-xl">Dataset Name*</span>
        <input type="text" name="metadata.Name" class="input input-bordered" />
        <ValidationMessage for="metadata.Name" let:messages>
          <span class="text-lg text-error">{messages || ''}</span>
        </ValidationMessage>
        <div class="divider" />
      </label>

      <!-- default metadata fields -->
      <MetadataFields {setData} />
    </div>

    <div class="divider" />

    <!-- this is a single creator **NOT** part of a field array -->
    <!-- specify the name of the form data property to store it as -->
    <h1 class="px-0 text-primary text-3xl">Creator*</h1>
    <div class="flex flex-col gap-6">
      <label for="creator-radio" class="text-xl"
        >Is the Data Creator the same as the Donor?*</label
      >

      <div id="creator-radio" class="flex gap-2 form-control max-w-sm">
        <label class="label cursor-pointer">
          <span class="label-text text-md">Yes</span>
          <input
            type="radio"
            class="radio radio-primary"
            on:change={() => setData('creator', currentUser)}
            bind:group={creatorIsDonor}
            value="Yes"
          />
        </label>
        <label class="label cursor-pointer">
          <span class="label-text text-md">No</span>
          <input
            type="radio"
            class="radio radio-primary"
            on:change={() => setData('creator', defaultCreator)}
            bind:group={creatorIsDonor}
            value="No"
          />
        </label>
      </div>
      <SingleCreatorInput bind:creator={$data.creator} name="creator." />
    </div>

    <div class="divider" />

    <div>
      <h1 class="text-primary text-3xl">Add Keywords*</h1>
      <AddKeywords bind:selectedValues={$data.keywords} />
    </div>

    <div class="divider" />

    <div>
      <h1 class="text-primary text-3xl">Add Creators*</h1>
      <div class="divider" />
      <CreatorFieldArray bind:creators={$data.creators} {addNewCreator} {removeCreator} />
    </div>

    <!-- parent form component can slot in controls -->
    <div class="flex gap-3">
      {#if onBack != null}
        <button
          class="btn btn-error w-32"
          on:click|preventDefault={() => onBack && onBack($data)}>Back</button
        >
      {/if}
      <button class="btn btn-primary w-32" type="submit">Next</button>
    </div>
  </form>
</div>

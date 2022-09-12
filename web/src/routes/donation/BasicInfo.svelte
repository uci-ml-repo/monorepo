<script lang="ts">
  import { MetadataSchema, CreatorSchema } from '$lib/schemas'
  import { z } from 'zod'

  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'

  import { defaultCreator } from '$lib/schemas/Creator'

  import MetadataFields from '$components/FormFields/Metadata.svelte'
  import SingleCreatorInput from '$components/FormFields/SingleCreatorInput.svelte'
  import CreatorFieldArray from '$components/FormFields/CreatorFieldArray.svelte'
  import AddKeywords from '$components/FormFields/AddKeywords.svelte'

  // initialize form, schema validation
  //////////////////////////////////////////
  const BasicInfoSchema = z.object({
    metadata: MetadataSchema.extend({
      Name: z.string().min(1, { message: 'Please enter a dataset name' }),
    }),
    creator: CreatorSchema,
    creators: CreatorSchema.array(),
    keywords: z.string().array(),
  })

  type BasicInfoFormData = z.TypeOf<typeof BasicInfoSchema>

  export let initialValues: BasicInfoFormData = {
    metadata: {
      Name: 'placeholder',
      Abstract: 'abstract',
      Area: 'Business',
      Types: ['Tabular'],
      Task: ['Regression'],
      DOI: null,
    },
    creator: {
      firstName: 'hi',
      lastName: 'there',
      email: null,
      institution: null,
      address: null,
    },
    creators: [],
    keywords: [],
  }

  export let onSubmit: (data: BasicInfoFormData) => void = (data: BasicInfoFormData) =>
    console.log(data)

  const { form, data, addField, unsetField } = createForm<BasicInfoFormData>({
    initialValues,
    extend: [validator({ schema: BasicInfoSchema }), reporter],
    onSubmit,
  })

  $: creators = $data.creators

  // field array controls
  //////////////////////////////////////////
  function removeCreator(index: number) {
    return unsetField(`creators.${index}`)
  }

  // add a new creator at the bottom of the field array
  function addNewCreator() {
    addField('creators', defaultCreator, creators.length || 0)
  }
</script>

<div class="max-w-4xl mx-auto my-16">
  <form use:form class="flex flex-col gap-8">
    <!-- metadata fields-->
    <div>
      <h1 class="text-primary text-3xl">Metadata*</h1>

      <!-- augment the regular metadata form field with a dataset name input-->
      <label for="metadata.Name" class="flex flex-col gap-4 my-4">
        <span class="text-xl">Dataset Name*</span>
        <input type="text" name="metadata.Name" class="input input-bordered" />
        <div class="divider" />
      </label>

      <!-- default metadata fields -->
      <MetadataFields />
    </div>

    <div class="divider" />

    <!-- this is a single creator **NOT** part of a field array -->
    <!-- specify the name of the form data property to store it as -->
    <div>
      <h1 class="text-primary text-3xl">Creator*</h1>
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

    <button type="submit" class="btn btn-primary" on:click|stopPropagation>Submit</button>
  </form>
</div>

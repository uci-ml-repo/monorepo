<script lang="ts">
  // props from the parent form component
  //////////////////////////////////////////
  export let onSubmit: (formData: DescriptiveFormData) => void = (data) => console.log(data)
  export let onBack: null | ((formData: DescriptiveFormData) => void) = null

  // imports
  //////////////////////////////////////////
  import { DescriptiveFormSchema } from '$lib/schemas/Donation'
  import type { DescriptiveFormData } from '$lib/schemas/Donation'

  import { donationFormData } from '$lib/stores'

  import DescriptiveFields from '$components/Fields/Descriptive.svelte'

  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'

  // initialize form
  //////////////////////////////////////////
  const { form, data } = createForm<DescriptiveFormData>({
    initialValues: {
      descriptive: $donationFormData.descriptive,
    },
    extend: [validator({ schema: DescriptiveFormSchema }), reporter],
    onSubmit,
  })
</script>

<form use:form class="flex flex-col gap-4 max-w-4xl mx-auto">
  <DescriptiveFields />
  <div class="flex gap-6">
    {#if onBack != null}
      <button
        class="btn btn-error w-40"
        on:click|preventDefault={() => onBack && onBack($data)}>Back</button
      >
    {/if}
    <button class="btn btn-primary w-40" type="submit">Done</button>
  </div>
</form>

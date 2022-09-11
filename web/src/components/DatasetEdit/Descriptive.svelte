<script lang="ts">
  import { DescriptiveSchema } from '$lib/schemas'
  import { z } from 'zod'

  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'

  import Descriptive from '$components/CustomFormFields/Descriptive.svelte'

  export let ID = 0

  const DescriptiveEditSchema = DescriptiveSchema.extend({
    rationale: z.string(),
  })

  type DescriptiveEditFormData = z.TypeOf<typeof DescriptiveEditSchema>

  // default submit when using this edit component standalone; can be overridden
  export let onSubmit = (data: DescriptiveEditFormData) => {
    console.log(data)
  }

  const { form } = createForm<DescriptiveEditFormData>({
    extend: [validator({ schema: DescriptiveSchema }), reporter],
    onSubmit,
  })
</script>

<form use:form>
  <!-- form fields for the data, -->
  <Descriptive />
  <label for="descriptive-edit-rationale" class="flex flex-col gap-4">
    <span class="text-lg">Rationale (optional)</span>
    <input type="text" name="rationale" class="input input-bordered" />
  </label>

  <!-- allow props from parent component to control the submission/cancel process -->
  <slot />
</form>

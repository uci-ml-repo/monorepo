<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { z } from 'zod'

  import Descriptive from '$components/CustomFormFields/Descriptive.svelte'
  import { DescriptiveSchema } from '$lib/schemas'

  export let ID = 0

  // query all existing creators for this dataset
  //////////////////////////////////////////
  const query = useQuery(
    ['descriptive.getDescriptive', ID],
    async () => await trpc(fetch).query('descriptive.getDescriptive', ID)
  )

  const onSubmit = (data: DescriptiveEditFormData) => {
    console.log(data)
  }

  // initialize form
  ////////////////////////////////////////////
  const DescriptiveEditSchema = z.object({
    descriptive: DescriptiveSchema,
    rationale: z.string(),
  })

  type DescriptiveEditFormData = z.TypeOf<typeof DescriptiveEditSchema>

  const { form, isDirty, setInitialValues } = createForm<DescriptiveEditFormData>({
    extend: [validator({ schema: DescriptiveEditSchema }), reporter],
    onSubmit,
  })

  // if the query data updates and the form hasn't been touched, reset the initial values
  $: if (!$isDirty && $query.data) {
    setInitialValues({
      descriptive: $query.data,
      rationale: '',
    })
  }
</script>

<form use:form>
  <!-- form fields for the data, -->
  <Descriptive />

  <!-- rationale -->
  <label for="descriptive-edit-rationale" class="flex flex-col gap-4">
    <span class="text-lg">Rationale (optional)</span>
    <input type="text" name="rationale" class="input input-bordered" />
  </label>

  <!-- allow props from parent component to control the submission/cancel process -->
  <slot />
</form>

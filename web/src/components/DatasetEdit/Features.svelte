<script lang="ts">
  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { z } from 'zod'

  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import Spreadsheet from '$components/Spreadsheet/index.svelte'

  export let ID = 0
  export let onSubmit = (data: AttributeEditFormData) => console.log(data)

  // fetch existing attribute data
  //////////////////////////////////////////
  const featureQuery = useQuery(['attributes.getAttributes', ID], async () =>
    trpc(fetch).query('attributes.getAttributes', ID)
  )

  // initialize form
  //////////////////////////////////////////
  const AttributeEditSchema = z.object({
    attributes: z.any().array().array(),
    rationale: z.string(),
  })

  type AttributeEditFormData = z.TypeOf<typeof AttributeEditSchema>

  const { form, data } = createForm<AttributeEditFormData>({
    initialValues: {
      attributes: $featureQuery.data?.data || [],
    },
    extend: [validator({ schema: AttributeEditSchema }), reporter],
    onSubmit,
  })
</script>

<div>
  <!-- editing spreadsheet -->
  <!-- exclude this from the form because the table has inputs that can be registered into the form data; -->
  <!-- use binding to keep the values in sync -->
  <div class="w-full overflow-x-auto">
    <Spreadsheet bind:value={$data.attributes} />
  </div>

  <form use:form class="flex flex-col gap-4">
    <!-- rationale -->
    <label for="attribute-edit-rationale" class="flex flex-col gap-4">
      <span class="text-lg">Rationale (optional)</span>
      <input type="text" name="rationale" class="input input-bordered" />
    </label>

    <!-- default slot for parent to insert form controls -->
    <slot />
  </form>
</div>

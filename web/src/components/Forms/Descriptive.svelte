<script lang="ts">
  import { useMutation, useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'
  import { z } from 'zod'

  import Descriptive from '$components/Fields/Descriptive.svelte'
  import { DescriptiveSchema } from '$lib/schemas'
  import { queryClient } from '$lib/query'

  export let handleClose: () => void
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

  // mutation requests
  //////////////////////////////////////////

  // accept an edit if the person has authority
  const acceptMutation = useMutation(
    async (ID: number) => {
      return await trpc(fetch).mutation('edits.accept', ID)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['descriptive.getDescriptiveQA', ID])
      },
    }
  )

  // insert an edit
  const insertMutation = useMutation(
    async (data: DescriptiveEditFormData) => {
      return await trpc(fetch).mutation('edits.insert', {
        datasetID: ID,
        userID: 631,
        recordID: ID,
        actionID: 1,
        tableID: 4,
        data: data.descriptive,
        oldData: '',
        rationale: data.rationale,
      })
    },
    {
      onSuccess: (data) => {
        reset()
        $acceptMutation.mutate(data.ID, {
          onSuccess: () => {
            handleClose()
          },
        })
      },
    }
  )

  // initialize form
  ////////////////////////////////////////////
  const DescriptiveEditSchema = z.object({
    descriptive: DescriptiveSchema,
    rationale: z.string(),
  })

  type DescriptiveEditFormData = z.TypeOf<typeof DescriptiveEditSchema>

  const { form, isDirty, setInitialValues, reset } = createForm<DescriptiveEditFormData>({
    extend: [validator({ schema: DescriptiveEditSchema }), reporter],
    onSubmit: (data) => {
      $insertMutation.mutate(data)
    },
  })

  $: descriptive = $query.data

  // will be false until the form has been updated with the previous values
  let hasInitialized = false

  // if the query data updates and the form hasn't been touched, reset the initial values
  // redundant descriptive check is a null type guard for TypeScript
  $: if (!$isDirty && descriptive) {
    setInitialValues({
      descriptive,
      rationale: '',
    })
    hasInitialized = true
  }
</script>

<!-- re-mount the component if hasInitialized changes -->
{#key hasInitialized}
  <form use:form class="flex flex-col gap-4">
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
{/key}

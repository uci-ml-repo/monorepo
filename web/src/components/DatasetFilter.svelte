<script lang="ts">
  import { createForm } from 'felte'
  import { z } from 'zod'
  import X from '$components/Icons/X.svelte'
  import Check from '$components/Icons/Check.svelte'
  import { collapse } from '$lib/actions'
  import Dropdown from '$components/DropdownButton.svelte'

  import { useMutation } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import type { donated_datasets } from '@prisma/client'

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let datasets: donated_datasets[] = []

  // Schema for form validation/submission, not really necessary for this form
  //////////////////////////////////////////
  const FilterSchema = z.object({
    Types: z.string().optional(),
    Area: z.string().array().optional(),
    Task: z.string().optional(),
    NumAttributes: z.string().optional(),
    NumInstances: z.string().optional(),
    AttributeTypes: z.string().optional(),
  })

  type FilterFormData = z.TypeOf<typeof FilterSchema>

  const filterMutation = useMutation(
    'donated_datasets.searchDatasets',
    async (data: FilterFormData) => {
      const newDatasets = await trpc(fetch).mutation('donated_datasets.searchDatasets', data)
      dispatch('update', {
        datasets: newDatasets,
      })
    }
  )

  const clearFilters = () => {
    reset()
    $filterMutation.mutate({})
  }
  // form initialization
  //////////////////////////////////////////
  const { form, data, setData, reset } = createForm<FilterFormData>({
    onSubmit: (data) => {
      console.log(data)
      $filterMutation.mutate(data)
    },
  })

  // form options
  /////////////////////
  const CharacteristicOptions = [
    {
      label: 'Tabular',
      value: 'Tabular',
    },
    {
      label: 'Sequential',
      value: 'Sequential',
    },
    {
      label: 'Time-Series',
      value: 'Time-Series',
    },
    {
      label: 'Text',
      value: 'Text',
    },
    {
      label: 'Image',
      value: 'Image',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ]

  const SubjectAreaOptions = [
    {
      label: 'Business',
      value: 'Business',
    },
    {
      label: 'Computer Science',
      value: 'Computer',
    },
    {
      label: 'Engineering',
      value: 'Engineering',
    },
    {
      label: 'Game',
      value: 'Game',
    },
    {
      label: 'Law',
      value: 'Law',
    },
    {
      label: 'Life Sciences',
      value: 'Life Science',
    },
    {
      label: 'Physical Sciences',
      value: 'Physical',
    },
    {
      label: 'Social Sciences',
      value: 'Social',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ]

  const TaskOptions = [
    {
      label: 'Classification',
      value: 'Classification',
    },
    {
      label: 'Regression',
      value: 'Regression',
    },
    {
      label: 'Clustering',
      value: 'Clustering',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ]

  const NumAttributeOptions = [
    {
      label: 'Less than 10',
      value: '0-10',
    },
    {
      label: '10 to 100',
      value: '10-100',
    },
    {
      label: 'More than 100',
      value: '100-inf',
    },
  ]

  const NumInstanceOptions = [
    {
      label: 'Less than 100',
      value: '0-100',
    },
    {
      label: '100 to 1000',
      value: '100-1000',
    },
    {
      label: 'More than 1000',
      value: '1000-inf',
    },
  ]

  const AttributeTypeOptions = [
    {
      label: 'Numerical',
      value: 'Numerical',
    },
    {
      label: 'Categorical',
      value: 'Categorical',
    },
    {
      label: 'Mixed',
      value: 'Mixed',
    },
  ]

  // map object to UI fields
  //////////////////////////////////////////
  interface FieldOption {
    label: string
    value: string
  }

  interface Field {
    field: keyof FilterFormData
    label: string
    type: 'radio' | 'checkbox'
    options: FieldOption[]
    default?: string | string[] | undefined
  }

  const FormFields: Field[] = [
    {
      field: 'Types',
      label: 'Characteristics',
      type: 'radio',
      options: CharacteristicOptions,
    },
    {
      field: 'Area',
      label: 'Subject Area',
      type: 'checkbox',
      options: SubjectAreaOptions,
      default: [],
    },
    {
      field: 'Task',
      label: 'Associated Tasks',
      type: 'radio',
      options: TaskOptions,
    },
    {
      field: 'NumAttributes',
      label: '# Attributes',
      type: 'radio',
      options: NumAttributeOptions,
    },
    {
      field: 'NumInstances',
      label: '# Instances',
      type: 'radio',
      options: NumInstanceOptions,
    },
    {
      field: 'AttributeTypes',
      label: 'Attribute Types',
      type: 'radio',
      options: AttributeTypeOptions,
    },
  ]

  // indicate whether the submit/cancel buttons should show up
  // used by the collapse to transition them in/out
  $: formDataChanged = Object.values($data).some((k) => Boolean(k?.length))
</script>

<form use:form class="w-full p-4 max-h-[85vh] overflow-y-auto flex flex-col gap-2">
  <!-- header for filter options, uses collapse to animate buttons -->
  <div class="flex justify-end px-4">
    <span class="text-primary text-2xl">Options</span>

    <!-- flex a wrapper around collapse to position the button group -->
    <div class="flex justify-end w-full">
      <!-- submit and cancel buttons -->
      <!-- flex the inner wrapper to space the buttons and use collapse-->
      <div
        class="flex w-0 gap-4 overflow-hidden"
        use:collapse={{ open: formDataChanged, horizontal: true }}
      >
        <button type="submit" class="btn btn-success btn-outline btn-sm btn-circle">
          <Check />
        </button>
        <button
          type="button"
          class="btn btn-error btn-sm btn-outline btn-circle"
          on:click|preventDefault={clearFilters}
        >
          <X />
        </button>
      </div>
    </div>
  </div>

  <!-- form fields, map each object in the array to its own field; flex-column to space everything -->
  <div class="flex flex-col">
    {#each FormFields as Field}
      <!-- checkbox to clear the field -->
      <Dropdown startIconOpen={Boolean($data?.[Field.field]?.length)}>
        <label for="characteristic-dropdown" slot="start-icon">
          <input
            aria-label="{Field.field}-dropdown"
            type="checkbox"
            class="checkbox checkbox-primary"
            checked={Boolean($data?.[Field.field]?.length)}
            on:click|preventDefault|stopPropagation={() => setData(Field.field, Field.default)}
          />
        </label>

        <!-- title of field -->
        <span slot="title">{Field.label}</span>

        <!-- the radio/checkbox fields, grouped by the name = Field.field attribute -->
        <div slot="content">
          {#each Field.options as option}
            <label class="label cursor-pointer">
              <span class="label-text">{option.label}</span>
              <input
                type={Field.type}
                name={Field.field}
                class={Field.type === 'checkbox'
                  ? 'checkbox checkbox-primary'
                  : 'radio radio-primary'}
                checked={$data?.[Field.field]?.includes(option.value)}
                value={option.value}
              />
            </label>
          {/each}
        </div>
      </Dropdown>

      <!-- divider after each field -->
      <div class="divider my-0" />
    {/each}
  </div>
</form>

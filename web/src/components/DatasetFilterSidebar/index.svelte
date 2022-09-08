<script lang="ts">
  import { createForm } from 'felte'
  import { z } from 'zod'
  import X from '$components/Icons/X.svelte'
  import Check from '$components/Icons/Check.svelte'
  import { collapse } from '$lib/actions'

  import Dropdown from '$components/DropdownButton.svelte'

  import {
    CharacteristicOptions,
    SubjectAreaOptions,
    TaskOptions,
    NumAttributeOptions,
    NumInstanceOptions,
    AttributeTypeOptions,
  } from './Options'

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

  // form initialization
  //////////////////////////////////////////
  const { form, data, setData, reset } = createForm<FilterFormData>({
    onSubmit: (data) => {
      console.log(data)
    },
  })

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
          on:click|preventDefault={reset}
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

<script lang="ts">
  import { createForm } from 'felte'
  import { z } from 'zod'

  import Dropdown from '$components/DropdownButton.svelte'

  import {
    CharacteristicOptions,
    SubjectAreaOptions,
    TaskOptions,
    NumAttributeOptions,
    NumInstanceOptions,
    AttributeTypeOptions,
  } from './Options'

  const FilterSchema = z.object({
    Types: z.string().optional(),
    Area: z.string().array().optional(),
    Task: z.string().optional(),
    NumAttributes: z.string().optional(),
    NumInstances: z.string().optional(),
    AttributeTypes: z.string().optional(),
  })

  type FilterFormData = z.TypeOf<typeof FilterSchema>

  const { form, data, setData } = createForm<FilterFormData>({
    onSubmit(data) {
      console.log(data)
    },
  })

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
</script>

<form use:form class="w-full p-4 max-h-[90vh] overflow-y-auto">
  <button type="submit" class="btn btn-accent block ml-auto">Submit</button>

  <div class="flex flex-col">
    {#each FormFields as Field}
      <Dropdown startIconOpen={Boolean($data?.[Field.field]?.length)}>
        <label for="characteristic-dropdown" slot="start-icon">
          <input
            type="checkbox"
            class="checkbox checkbox-primary"
            checked={Boolean($data?.[Field.field]?.length)}
            on:click|preventDefault|stopPropagation={() => setData(Field.field, Field.default)}
          />
        </label>
        <span slot="title">{Field.label}</span>
        <div slot="content">
          {#each Field.options as option}
            <label class="label cursor-pointer">
              <span class="label-text">{option.label}</span>
              <input
                type={Field.type}
                name={Field.field}
                class="{Field.type} {Field.type}-primary"
                checked={$data?.[Field.field]?.includes(option.value)}
                value={option.value}
              />
            </label>
          {/each}
        </div>
      </Dropdown>
      <div class="divider my-0" />
    {/each}
  </div>
</form>

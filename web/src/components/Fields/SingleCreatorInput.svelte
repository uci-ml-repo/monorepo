<script lang="ts">
  import type { CreatorType } from '$lib/schemas/Creator'
  import { ValidationMessage } from '@felte/reporter-svelte'

  // a single creator will usually be part of an array under the creators property, e.g.
  // parentFormData = { creators: [...individual_creators] }, e.g.
  export let name = 'creators.0.'

  export let creator: CreatorType

  const CreatorFields: {
    field: keyof CreatorType
    required: boolean
    label: string
  }[] = [
    {
      field: 'firstName',
      required: true,
      label: 'First Name',
    },
    {
      field: 'lastName',
      required: true,
      label: 'Last Name',
    },
    {
      field: 'email',
      required: false,
      label: 'Email',
    },
    {
      field: 'institution',
      required: false,
      label: 'Institution',
    },
    {
      field: 'address',
      required: false,
      label: 'Address',
    },
  ]
</script>

<div class="flex flex-col gap-2">
  {#each CreatorFields as { field, label, required }}
    <label for="{name}{field}" class="text-lg">{label}{required ? '*' : ''}</label>
    <input
      id="{name}{field}"
      name="{name}{field}"
      type="text"
      class="input input-bordered"
      {required}
      placeholder={label}
      bind:value={creator[field]}
    />
    <ValidationMessage for="{name}{field}" let:messages={message}>
      <span class="text-error">{message || ''}</span>
    </ValidationMessage>
  {/each}
</div>

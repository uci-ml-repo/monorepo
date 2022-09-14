<script lang="ts">
  import { collapse } from '$lib/actions'
  import TrashIcon from '$components/Icons/Trash.svelte'
  import CheckIcon from '$components/Icons/Check.svelte'
  import CaretIcon from '$components/Icons/Caret.svelte'

  interface Dataset {
    ID: number
    Name: string
    Graphics: string | null
    slug: string | null

    Abstract: string
    Task: string | null
    NumInstances: number
    NumAttributes: number | null

    Area: string | null
    Types: string | null
    AttributeTypes: string | null
    DateDonated: Date | string | null
    NumHits: number

    users: {
      firstName: string
      lastName: string
      user: string
    }
  }

  export let dataset: Dataset

  // the parent has a toggle all button
  export let showAll = false

  let open = false

  // whenever toggle all is triggerred, update this state
  $: open = showAll

  const toggleOpen = () => (open = !open)
</script>

<tr class="hover border w-full" on:click={toggleOpen}>
  <td>
    <div class="flex justify-center gap-8">
      <button class="btn btn-circle btn-sm btn-ghost" on:click|stopPropagation>
        <CheckIcon class="h-5 fill-success" />
      </button>
      <button class="btn btn-circle btn-sm btn-ghost" on:click|stopPropagation>
        <TrashIcon class="h-5 fill-error" />
      </button>
    </div>
  </td>
  <td><CaretIcon {open} /></td>
  <td>{dataset?.Name}</td>
  <td>{dataset?.users?.firstName} {dataset?.users?.lastName}</td>
  <td>{new Date(dataset?.DateDonated || '').toLocaleDateString('en')}</td>
</tr>

<tr class="w-full">
  <td colspan="5">
    <div use:collapse={{ open, baseHeight: 0, lineClamp: 0 }}>
      <div>
        <span class="text-lg font-semibold">Abstract: </span>
        <span>{dataset?.Abstract}</span>
      </div>

      <div class="divider my-2" />

      <table>
        <tr>
          <th width="25%">Task</th>
          <th width="25%">Types</th>
          <th width="25%">Area</th>
          <th width="25%">Attribute Types</th>
        </tr>
        <tr>
          <td>{dataset?.Task}</td>
          <td>{dataset?.Types}</td>
          <td>{dataset?.Area}</td>
          <td>{dataset?.AttributeTypes}</td>
        </tr>
      </table>
    </div></td
  >
</tr>

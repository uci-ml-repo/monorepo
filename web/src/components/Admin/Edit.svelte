<script lang="ts">
  import { collapse } from '$lib/actions'

  import CheckIcon from '$components/Icons/Check.svelte'
  import TrashIcon from '$components/Icons/Trash.svelte'
  import CaretIcon from '$components/Icons/Caret.svelte'

  import type { Prisma } from '@prisma/client'

  export let edit: Prisma.editsGetPayload<{
    include: {
      donated_datasets: true
      edit_actions: true
      tables: true
      users: {
        select: {
          firstName: true
          lastName: true
        }
      }
    }
  }>

  // the parent has a toggle all button
  export let showAll = false

  let open = false

  // whenever toggle all is triggerred, update this state
  $: open = showAll

  const toggleOpen = () => (open = !open)
</script>

<tr class="border hover" on:click|stopPropagation={toggleOpen}>
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
  <td>{edit.donated_datasets?.Name}</td>
  <td>{edit.edit_actions?.action}</td>
  <td>{edit.tables?.name}</td>
  <td>{edit.users?.firstName} {edit.users?.lastName}</td>
</tr>

<tr class="w-full">
  <td colspan="6">
    <div use:collapse={{ open, baseHeight: 0, lineClamp: 0 }}>
      <table class="w-full">
        <tr>
          <th width="50%">Old Data</th>
          <th width="50%">New Data</th>
        </tr>
        <tr>
          <td>
            <pre class="whitespace-pre-wrap break-all">{JSON.stringify(
                JSON.parse(edit.oldData || '{}'),
                null,
                2
              )}</pre>
          </td>
          <td>
            <pre class="whitespace-pre-wrap break-all">{JSON.stringify(
                edit.data,
                null,
                2
              )}</pre>
          </td>
        </tr>
      </table>
    </div>
  </td>
</tr>

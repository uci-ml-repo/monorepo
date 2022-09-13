<script lang="ts">
  import type { users } from '@prisma/client'

  import CheckIcon from '$components/Icons/Check.svelte'
  import TrashIcon from '$components/Icons/Trash.svelte'

  export let user: users
</script>

<tr>
  <td>{user.user}</td>
  <td>{user.firstName} {user.lastName}</td>
  <td>{user.role}</td>
  <td>
    <div class="flex gap-8">
      <button class="btn btn-circle btn-sm btn-ghost" on:click|stopPropagation>
        <CheckIcon class="h-5 fill-success" />
      </button>
      <button class="btn btn-circle btn-sm btn-ghost" on:click|stopPropagation>
        <TrashIcon class="h-5 fill-error" />
      </button>
    </div>
  </td>
</tr>

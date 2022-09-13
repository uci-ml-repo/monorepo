<script lang="ts">
  import CheckIcon from '$components/Icons/Check.svelte'
  import TrashIcon from '$components/Icons/Trash.svelte'

  export let keyword = ''
</script>

<tr>
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
  <td>{keyword}</td>
</tr>

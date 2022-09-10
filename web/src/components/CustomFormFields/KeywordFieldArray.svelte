<script lang="ts">
  //import PlusIcon from '$components/Icons/Plus.svelte'
  import XIcon from '$components/Icons/X.svelte'

  export let index: number

  // a creator object that will be forwarded and bound to the underlying creator field
  export let keyword: string

  // provide a function to remove a creator from the parent form
  export let removeKeyword: (index: number) => void

  // provide a function to add a creator from the form
  // export let addCreator: (index: number) => void
</script>

<div>
  <div class="flex justify-between">
    <h1 class="text-2xl">Creator {index + 1}</h1>
    <button
      class="btn btn-error btn-circle"
      on:click|preventDefault={() => removeKeyword(index)}
    >
      <XIcon />
    </button>
    <span>{keyword}</span>
  </div>
</div>

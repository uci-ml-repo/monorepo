<script lang="ts">
  import type { CreatorType } from '$lib/schemas/Creator'
  import SingleCreatorInput from './SingleCreatorInput.svelte'
  //import PlusIcon from '$components/Icons/Plus.svelte'
  import XIcon from '$components/Icons/X.svelte'

  export let index: number

  // a creator object that will be forwarded and bound to the underlying creator field
  export let creator: CreatorType

  // provide a function to remove a creator from the parent form
  export let removeCreator: (index: number) => void

  // provide a function to add a creator from the form
  // export let addCreator: (index: number) => void
</script>

<div>
  <div class="flex justify-between">
    <h1 class="text-xl">Creator {index + 1}</h1>
    <button
      class="btn btn-error btn-circle btn-outline"
      on:click|preventDefault={() => removeCreator(index)}
    >
      <XIcon />
    </button>
  </div>
  <SingleCreatorInput name="creators.{index}" bind:creator />
</div>

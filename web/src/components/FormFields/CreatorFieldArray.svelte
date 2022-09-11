<script lang="ts">
  import type { CreatorType } from '$lib/schemas/Creator'
  import SingleCreatorInput from './SingleCreatorInput.svelte'
  import XIcon from '$components/Icons/X.svelte'

  // index for this creator, e.g. "the nth creator"
  export let index: number

  // a creator object from the form data
  // that will be forwarded and bound to the underlying single creator field
  export let creator: CreatorType

  // provide a function to remove a creator from the parent form
  export let removeCreator: (index: number) => void

  // by default, this form data will be listed under the "creators" property of the parent form,
  // e.g. parentFormData = { creators: [...] }
  export let name = 'creators.'
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
  <SingleCreatorInput name="{name}{index}" bind:creator />
</div>

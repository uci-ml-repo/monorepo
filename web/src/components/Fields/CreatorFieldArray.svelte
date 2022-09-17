<script lang="ts">
  // a creator field array requires that the parent initialize a form with a field array, e.g.
  // a form with a creators property that has an array of creators, formData = { creators: [creator] }
  // and bind $data.creators to the creators prop
  import type { CreatorType } from '$lib/schemas/Creator'
  import SingleCreatorInput from './SingleCreatorInput.svelte'
  import XIcon from '$components/Icons/X.svelte'
  import PlusIcon from '$components/Icons/Plus.svelte'

  // after initializing the form creator field array, bind the array to this component
  export let creators: CreatorType[] = []

  // provide a remove function related to the field array from the parent
  // takes the index of a creator and should remove the input from the field array
  export let removeCreator: (index: number) => void = (index) => console.log(index)

  // provide an add function related to the field array from the parent
  // takes no arguments, and should add a new creator to the creators array
  export let addNewCreator: () => void = () => console.log('add new creator')

  // by default, the field array will register the array of creators under the "creators" property
  export let name = 'creators.'
</script>

<div>
  <div>
    <!-- map each creator to an individual creator input -->
    {#each creators as creator, index}
      <!-- header for creator, includes the creator # and a remove button -->
      <!-- can be overridden with a named slot; the index of the creator is provided -->
      <slot name="title" {index}>
        <!-- by default, display a title (Creator #) and an X icon that will call the remove function -->
        <div class="flex justify-between">
          <h1 class="text-xl">Creator {index + 1}</h1>
          <button
            class="btn btn-error btn-circle btn-outline"
            on:click|preventDefault={() => removeCreator(index)}
          >
            <XIcon />
          </button>
        </div>
      </slot>

      <!-- include a single creator input and bind it to the form data -->
      <!-- note the period at the end; the child directly appends its field name to the name -->
      <!-- e.g. so give it "creators.1." as the name, and it will store the field creators.1.firstName -->
      <SingleCreatorInput name="{name}{index}." bind:creator />

      <div class="divider" />
    {/each}
  </div>
  <button
    class="btn btn-primary w-50 mx-auto flex gap-2"
    on:click|preventDefault={addNewCreator}
  >
    <span>
      {creators?.length ? 'Add More Creators' : 'Begin Adding Creators'}
    </span>
    <PlusIcon class="fill-white" />
  </button>

  <!-- accept a slot from the parent component to control the form -->
  <slot />
</div>

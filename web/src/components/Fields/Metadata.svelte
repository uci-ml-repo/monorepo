<script lang="ts">
  /*
     like the other form fields, the metadata form field just displays a bunch of
     HTML input fields with a name + field to register it under a parent felte form component

     unfortunately the DOI has extra controls, where it has to set the DOI to null
     if "No DOI" is selected, so the parent (should) give this component the setData
     store from the createForm invocation, as well as a calculated hasDOI,
     view $components/DatasetEdit/Metadata.svelte for an example of usage
   */
  import { ValidationMessage } from '@felte/reporter-svelte'

  export let name = 'metadata.'

  export let hasDOI = 'No'

  // unfortunately, because the DOI is kinda complicated,
  // this form field needs access to setData to set the DOI to null on demand
  export let setData: (d: string, value: unknown) => void = () => console.log(`can't set data`)

  // enumerated form fields
  //////////////////////////////////////////
  const Areas = [
    'Business',
    'Computer Science',
    'Engineering',
    'Game',
    'Law',
    'Life Science',
    'Physical Science',
    'Social Science',
    'Other',
  ]

  const Types = [
    'Tabular',
    'Sequential',
    'Multivariate',
    'Time-Series',
    'Text',
    'Image',
    'Other',
  ]

  const Tasks = ['Classification', 'Regression', 'Clustering', 'Other']
</script>

<div>
  <!-- abstract text input -->
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label for="metadata.Abstract" class="text-xl">Abstract*</label>
      <input
        id="{name}Abstract"
        name="{name}Abstract"
        type="text"
        class="input input-bordered"
        placeholder="Abstract"
        required
      />
      <ValidationMessage for="{name}Abstract" let:messages>
        <span class="text-error">{messages || ''}</span>
      </ValidationMessage>
    </div>

    <div class="divider" />

    <!-- area radio buttons -->
    <div class="flex flex-col gap-2">
      <label for="area-radio" class="text-xl">Areas*</label>
      <div id="area-radio" class="form-control flex gap-4 max-w-sm">
        {#each Areas as Area}
          <label class="label cursor-pointer flex gap-3">
            <span class="label-text text-md">{Area}</span>
            <input type="radio" name="{name}Area" value={Area} class="radio radio-primary" />
          </label>
        {/each}
      </div>
      <ValidationMessage for="{name}Area" let:messages>
        <span class="text-error">{messages || ''}</span>
      </ValidationMessage>
    </div>

    <div class="divider" />

    <!-- types checkboxes -->
    <div class="flex flex-col gap-2">
      <label for="types-checkbox" class="text-xl">Types*</label>
      <div id="types-checkbox" class="flex gap-2 form-control max-w-sm">
        {#each Types as Type}
          <label class="label cursor-pointer">
            <span class="label-text text-md">{Type}</span>
            <input
              type="checkbox"
              name="{name}Types"
              value={Type}
              class="checkbox checkbox-primary"
            />
          </label>
        {/each}
      </div>
      <ValidationMessage for="{name}Types" let:messages>
        <span class="text-error">{messages || ''}</span>
      </ValidationMessage>
    </div>

    <div class="divider" />

    <!-- DOI radio buttons and text input -->
    <div class="flex flex-col gap-2">
      <!-- hasDOI radio buttons-->
      <label for="metadata.DOI" class="text-xl">DOI*</label>
      <div id="DOI-radio" class="flex gap-2 form-control max-w-sm">
        <label class="label cursor-pointer">
          <span class="label-text text-md">Yes</span>
          <input
            type="radio"
            class="radio radio-primary"
            bind:group={hasDOI}
            value="Yes"
            on:change={() => setData('metadata.DOI', '')}
          />
        </label>
        <label class="label cursor-pointer">
          <span class="label-text text-md">No</span>
          <input
            type="radio"
            class="radio radio-primary"
            bind:group={hasDOI}
            value="No"
            on:change={() => setData('metadata.DOI', null)}
          />
        </label>
      </div>

      <!-- DOI text input if hasDOI is true -->
      <input
        id="{name}DOI"
        name="{name}DOI"
        type="text"
        class="input input-bordered"
        class:hidden={hasDOI === 'No'}
      />
    </div>

    <div class="divider" />

    <!-- task checkboxes -->
    <div class="flex flex-col gap-2">
      <label for="task-checkbox" class="text-xl">Task*</label>
      <div id="task-checkbox" class="flex gap-2 form-control max-w-sm">
        {#each Tasks as Task}
          <label class="label cursor-pointer">
            <span class="label-text text-md">{Task}</span>
            <input
              type="checkbox"
              name="{name}Task"
              value={Task}
              class="checkbox checkbox-primary"
            />
          </label>
        {/each}
      </div>
      <ValidationMessage for="{name}Task" let:messages>
        <span class="text-error">{messages || ''}</span>
      </ValidationMessage>
    </div>
  </div>

  <slot />
</div>

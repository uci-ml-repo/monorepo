<script lang="ts">
  // props from parent form component
  //////////////////////////////////////////
  export let onSubmit: (formData: any) => void = (data: FormData) => console.log(data)
  export let onBack: null | ((formData: any) => void) = null

  // imports
  //////////////////////////////////////////
  import Spreadsheet from '$components/Spreadsheet/index.svelte'
  import FileInput from '$components/FormFields/File.svelte'
  import { createForm } from 'felte'

  import { donationFormData } from '$lib/stores'

  import type { TabularFormData } from '$lib/schemas/Donation'

  // initialize form
  //////////////////////////////////////////
  const { form, data, setData } = createForm<TabularFormData>({
    initialValues: {
      tabular: $donationFormData.tabular,
      files: $donationFormData.files,
      Graphics: $donationFormData.Graphics,
      attributes: $donationFormData.attributes,
    },
    onSubmit,
  })

  // other state stuff
  //////////////////////////////////////////

  // prop for the spreadsheet parser
  let hasHeaderRow = 'No'
  let hasMissing = 'No'

  // state for this component
  let format = 'tabular'

  // whenever format changes to other, reset the tabular data
  $: if (format !== 'tabular') {
    setData('tabular', {})
    setData('files.csv', null)
    setData('files.testData', null)
    setData('files.supplemental', null)
  }

  // whenever format changes to tabular, reset the supplemental file
  $: if (format !== 'other') {
    setData('files.supplemental', null)
  }
</script>

<form use:form class="flex flex-col gap-6 px-8 py-4 mx-auto min-w-[50vw] max-w-4xl">
  <h1 class="text-3xl text-primary">File and Tabular Data Upload</h1>

  <!-- prompt if uploading tabular data -->
  <div class="flex gap-2 max-w-sm form-control">
    <h1 class="text-xl">What format is the data file?*</h1>
    <label class="label cursor-pointer">
      <span class="label-text text-md">Tabular (e.g. csv)</span>
      <input type="radio" class="radio radio-primary" value="tabular" bind:group={format} />
    </label>
    <label class="label cursor-pointer">
      <span class="label-text text-md">Other (e.g. zip)</span>
      <input type="radio" class="radio radio-primary" value="other" bind:group={format} />
    </label>
  </div>

  <!-- if uploading tabular data, show some more questions -->
  {#if format === 'tabular'}
    <h1 class="text-primary text-2xl">Tabular Information</h1>

    <!-- header row -->

    <h1 class="text-xl">Does your data contain a header row?*</h1>
    <div class="flex gap-2 form-control max-w-sm">
      <label class="label cursor-pointer">
        <span class="label-text text-md">Yes</span>
        <input
          type="radio"
          class="radio radio-primary"
          value="Yes"
          bind:group={hasHeaderRow}
        />
      </label>
      <label class="label cursor-pointer">
        <span class="label-text text-md">No</span>
        <input type="radio" class="radio radio-primary" value="No" bind:group={hasHeaderRow} />
      </label>
    </div>

    <!-- missing values -->

    <h1 class="text-xl">Does your dataset contain missing values?*</h1>
    <div class="flex gap-2 form-control max-w-sm">
      <label class="label cursor-pointer">
        <span class="label-text text-md">Yes</span>
        <input type="radio" class="radio radio-primary" value="Yes" bind:group={hasMissing} />
      </label>
      <label class="label cursor-pointer">
        <span class="label-text text-md">No</span>
        <input
          type="radio"
          class="radio radio-primary"
          value="No"
          bind:group={hasMissing}
          on:change={() => setData('tabular.missingValues', null)}
        />
      </label>
      <label class:hidden={hasMissing === 'No'} class="flex flex-col gap-4">
        <span>Symbol for Missing Values</span>
        <input name="tabular.missingValues" type="text" class="input input-bordered" />
      </label>
    </div>

    <!-- upload a CSV -->

    <div class="flex flex-col gap-6">
      <h1 class="text-xl">Upload Test data here*</h1>
      <FileInput bind:value={$data.files.testData} />
    </div>
    <div class="flex flex-col gap-6 p-4 max-w-full">
      <h1 class="text-xl">Upload CSV data here*</h1>
      <!-- the spreadsheet will manage attributes and the CSV file-->
      <!-- internally, it binds the csv file to the custom file input form field -->
      <!-- the spreadsheet contains inputs, so the form data is a bit polluted -->
      <Spreadsheet
        bind:value={$data.attributes}
        bind:file={$data.files.csv}
        hasHeaderRow={hasHeaderRow === 'Yes'}
        missingIndicator={$data?.tabular?.missingValues}
      />
    </div>
  {/if}

  <!-- always show the option to upload supplemental data -->
  <div class="flex flex-col gap-6 w-full">
    <h1 class="text-xl">Upload supplemental data here*</h1>
    <FileInput bind:value={$data.files.supplemental} />
  </div>

  <div class="flex gap-3">
    {#if onBack != null}
      <button
        class="btn btn-error w-32"
        on:click|preventDefault={() => onBack && onBack($data)}>Back</button
      >
    {/if}
    <button class="btn btn-primary w-32" type="submit">Next</button>
  </div>
</form>

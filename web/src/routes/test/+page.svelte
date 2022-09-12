<script lang="ts">
  import Spreadsheet from '$components/Spreadsheet/index.svelte'
  import FileInput from '$components/FormFields/File.svelte'
  //import { FileSchema } from '$lib/schemas';
  import type { FileType } from '$lib/schemas/File'

  export let initialValues = {
    tabular: {
      missingValues: null,
    },

    files: {
      supplemental: null,
      testData: null,
      csv: null,
    },

    Graphics: null,

    attributes: [],
  }

  //export let onSubmit: (formData: any) => void
  //export let onBack: null | ((formData: any) => void) = null

  import { createForm } from 'felte'

  interface Tabular {
    missingValues: null | string | number
  }

  interface TabularFormData {
    tabular: Tabular | null
  }

  interface AttributeFormData {
    attributes: string[][]
  }

  interface FormData extends TabularFormData, AttributeFormData {
    files: {
      csv: FileType | null
      testData: FileType | null
      supplemental: FileType | null
    }
  }

  const { form, data, setData } = createForm<FormData>({
    initialValues,
    onSubmit: (data: FormData) => console.log(data),
  })

  $: console.log($data)

  // prop for the spreadsheet parser
  let hasHeaderRow = 'No'
  let hasMissing = 'No'

  // state for this component
  let format = 'tabular'

  // whenever format changes to other, reset the tabular data
  $: if (format !== 'tabular') {
    setData('tabular', null)
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

  {#if format === 'tabular'}
    <h1 class="text-primary text-2xl">Tabular Information</h1>

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

  <div class="flex flex-col gap-6 w-full">
    <h1 class="text-xl">Upload supplemental data here*</h1>
    <FileInput bind:value={$data.files.supplemental} />
  </div>

  <button class="btn btn-primary">Submit</button>
</form>

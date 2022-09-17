<script lang="ts">
  // let a parent component bind to the files this component has
  // will update whenever csvFile changes
  export let file: File

  import { parse } from 'papaparse'
  import type { ParseResult } from 'papaparse'

  import Fa from 'svelte-fa'
  import { faFileExcel, faX } from '@fortawesome/free-solid-svg-icons'

  // save the file input
  let csvRef: HTMLInputElement

  // parent (e.g. spreadsheet) can pass a function for the parser to run when
  // it's done accepting a file upload
  export let handleUpload: (result: ParseResult<string>) => void

  // parent component can also handle file removal
  export let handleRemove: () => void

  function handleChange(event: Event) {
    let newFiles = Array.from((event.target as HTMLInputElement).files || [])

    // there's only one file, so just get the first one
    file = newFiles[0]

    // let papaparse read the file, then call the parent to handle the results
    parse(newFiles[0], {
      header: false,
      skipEmptyLines: true,
      preview: 5000,
      fastMode: true,

      // when parsing is done, parent handles the result (2D array of strings)
      complete: handleUpload,
    })
  }

  const removeFile = () => {
    // reset file
    csvRef.value = ''

    // call the parent's remove function
    handleRemove()
  }
</script>

<div class="flex flex-col gap-6">
  <label
    class="relative border border-primary h-24 cursor-pointer rounded-md flex items-center justify-center border-dashed"
  >
    {#if csvRef?.files?.[0]}
      <div class="flex gap-3 items-center justify-center h-full">
        <div on:click|preventDefault={removeFile}>
          <Fa icon={faX} class="btn btn-error btn-outline btn-sm top-0 right-0 absolute" />
        </div>
        <span>{csvRef.files[0].name}</span>
        <Fa icon={faFileExcel} class="text-2xl" />
      </div>
    {:else}
      <span> Upload File Here</span>
    {/if}
    <input
      class="w-full h-full hidden"
      id="file_input"
      type="file"
      on:change|preventDefault={handleChange}
      bind:this={csvRef}
    />
  </label>
</div>

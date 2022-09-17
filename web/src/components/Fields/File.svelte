<script lang="ts">
  import XIcon from '$components/Icons/X.svelte'
  import UploadIcon from '$components/Icons/Upload.svelte'
  import { FileToObject } from '$lib/utils'
  import ExcelIcon from '$components/Icons/Excel.svelte'

  // binding points: the parent can bind these props to receive data collected by this input
  //////////////////////////////////////////

  // custom file object for sending to the server without FormData API
  export let value: FileObject | null = null

  // whenever a file is uploaded the input's files property updates
  let files: FileList

  // whenever files changes, call an asynchronous function to convert the file into
  // a custom file object
  const handleChange = () => {
    updateValue()
  }

  // file upload controls
  //////////////////////////////////////////
  const updateValue = async () => (value = await FileToObject(files[0]))

  // the parent can also react to this event by observing if the value.data becomes empty, e.g.
  // $: if (!value.data) { reset something in the parent component }
  const reset = () => (value = null)
</script>

<div class="h-full w-full flex flex-col gap-4">
  <!-- the file upload box size depends on parent container -->
  <!-- everything takes up full height of parent -->
  <label class="cursor-pointer h-5/6 w-full flex flex-col gap-4">
    <!-- show an upload box around the upload button and any children from the parent -->
    <div
      class="border border-dashed border-8 h-full w-full flex flex-col justify-center items-center gap-4 hover:bg-base-300 p-4"
    >
      <!-- if there is no data, then show an upload button in the center of the upload box -->
      {#if !value?.data}
        <UploadIcon />
        <span class="text-lg">Upload here</span>
      {:else}
        <!-- parent can pass in a something to show whenever a file is uploaded-->
        <!-- the parent should've bound to the values above, and it can use them to decide what to show -->
        <slot>
          <!-- by default, just show the filename and an icon -->
          <div class="flex gap-3 items-center justify-center h-full">
            <span>{value.name}</span>
            <ExcelIcon class="h-12 text-primary fill-primary" />
          </div>
        </slot>
      {/if}
    </div>

    <!-- the file input emits a second on change event that the parent can handle -->
    <input style="display:none" type="file" bind:files on:change={handleChange} on:change />
  </label>

  <!-- if there is data in the file upload, show 2 additional controls -->
  <!-- outside of the upload box -->
  {#if value?.data}
    <div class="flex justify-center gap-4">
      <div class="flex gap-4 btn btn-ghost">
        <span class="text-lg">Choose</span>
        <UploadIcon />
      </div>
      <button
        class="flex gap-4 btn btn-outline btn-error"
        on:click|preventDefault|stopPropagation={reset}
      >
        <span class="text-lg">Reset</span>
        <XIcon />
      </button>
    </div>
  {/if}
</div>

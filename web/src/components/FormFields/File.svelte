<script lang="ts">
  import XIcon from '$components/Icons/X.svelte'
  import UploadIcon from '$components/Icons/Upload.svelte'
  import { FileToObject } from '$lib/utils'

  const defaultFile = {
    data: '',
    name: '',
    lastModified: 69420,
  }

  let files: FileList

  export let value: FileObject = { ...defaultFile }

  $: data = value?.data

  $: if (files?.[0]) {
    updateFile()
  }

  const updateFile = async () => {
    value = await FileToObject(files[0])
  }

  const reset = () => {
    value = { ...defaultFile }
    data = ''
  }
</script>

<!-- the file upload box size depends on parent container -->
<!-- everything takes up full height of parent -->
<label for="dataset-graphics" class="cursor-pointer h-full w-full">
  <!-- if file selected, show button to change upload -->
  {#if data}
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
  {:else}
    <!-- else show upload box -->
    <div
      class="border border-dashed border-8 h-full w-full flex justify-center items-center gap-4 hover:bg-base-300"
    >
      <UploadIcon />
      <span class="text-lg">Upload here</span>
    </div>
  {/if}
  <input
    id="dataset-graphics"
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png"
    bind:files
  />
</label>

<script lang="ts">
  import FileInput from '$components/FormFields/File.svelte'
  import { FileSchema } from '$lib/schemas'
  import { z } from 'zod'

  import { createForm } from 'felte'

  const GraphicEditSchema = z.object({
    Graphics: FileSchema,
    rationale: z.string(),
  })

  type GraphicFormData = z.TypeOf<typeof GraphicEditSchema>

  export let onSubmit = (data: GraphicFormData) => console.log(data)
  export let onDelete = () => console.log('deleted!')

  const { form, data } = createForm<GraphicFormData>({
    onSubmit,
  })
</script>

<div class="flex flex-col gap-4">
  <!-- graphic edit title -->
  <h1 class="text-2xl text-primary text-center">Edit Image</h1>

  <!-- form data for graphic -->
  <form use:form class="flex flex-col gap-4">
    <!-- a box around the file upload will have a height of 64 when there's no file, -->
    <!-- and undefined (0ish) height when there is a file -->
    <div class:h-64={!$data?.Graphics?.data}>
      <FileInput bind:value={$data.Graphics}>
        <div class="w-full flex justify-center p-2">
          <img src={$data.Graphics.data} alt="dataset-graphic" class="h-64" />
        </div>
      </FileInput>
    </div>

    <!-- rationale for updating graphic -->
    <label for="descriptive-edit-rationale" class="flex flex-col gap-4">
      <span class="text-lg">Rationale (optional)</span>
      <input type="text" name="rationale" class="input input-bordered" />
    </label>

    <!-- allow props from parent component to control the submission/cancel process -->
    <slot />
  </form>

  <div class="divider" />

  <!-- delete dataset option-->
  <h1 class="text-2xl text-primary text-center">Delete Dataset</h1>
  <p>Note: This will not completely delete the dataset, but mark its status as "pending".</p>
  <button on:click={onDelete} class="btn btn-error btn-outline">Delete</button>
</div>

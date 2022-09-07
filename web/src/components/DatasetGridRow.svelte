<script lang="ts">
  import { AbbrevNum } from '$lib/utils'

  import ClipboardIcon from '$components/Icons/Clipboard.svelte'
  import ColumnsIcon from '$components/Icons/Columns.svelte'
  import RowsIcon from '$components/Icons/Rows.svelte'

  // subset of a dataset object needed to initialize this component
  interface Dataset {
    ID: number
    Name: string
    Graphics: string | null
    slug: string | null

    Abstract: string
    Task: string | null
    NumInstances: number
    NumAttributes: number | null
  }

  export let dataset: Dataset
</script>

<div class="hover:bg-base-200 p-2 rounded-lg">
  <h1 class="text-primary text-center font-bold break-word underline">
    <a href="/dataset/{dataset.slug}" class="btn btn-ghost">
      {dataset.Name}
    </a>
  </h1>

  <!-- Avatar that will appear under the title when screen is small -->
  <div class="avatar col-span-1 self-center justify-center w-full my-2 sm:hidden">
    <div class="mask mask-squircle w-12 h-12 flex align-center">
      <img
        src={dataset?.Graphics != null
          ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
          : '/ml/datasets/default/SmallLarge.jpg'}
        alt=""
      />
    </div>
  </div>

  <!-- Avatar that will appear to the left of the row when screen is larger -->
  <div class="grid grid-cols-12">
    <div class="avatar col-span-1 self-center justify-self-center hidden sm:flex">
      <div class="mask mask-squircle w-12 h-12 flex align-center">
        <img
          src={dataset?.Graphics != null
            ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
            : '/ml/datasets/default/SmallLarge.jpg'}
          alt=""
        />
      </div>
    </div>

    <div class="col-span-11 gap-5 ml-4">
      <h2 class="my-4 line-clamp-4 break-word overflow-x-hidden">
        {dataset.Abstract}
      </h2>
      <div class="hidden md:grid grid-cols-12">
        <div class="col-span-4 flex gap-2">
          <ClipboardIcon />
          {dataset.Task}
        </div>
        <div class="col-span-4 flex gap-2">
          <ColumnsIcon />
          {dataset?.NumInstances ? AbbrevNum(dataset.NumInstances) + '  Instances' : 'N/A'}
        </div>
        <div class="col-span-4 flex gap-2">
          <RowsIcon />
          {dataset?.NumAttributes ? AbbrevNum(dataset.NumAttributes) + '  Attributes' : 'N/A'}
        </div>
      </div>
    </div>
  </div>
</div>
<div class="divider my-0" />

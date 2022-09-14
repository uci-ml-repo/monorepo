<script lang="ts">
  import { AbbrevNum } from '$lib/utils'

  import ClipboardIcon from '$components/Icons/Clipboard.svelte'
  import ColumnsIcon from '$components/Icons/Columns.svelte'
  import RowsIcon from '$components/Icons/Rows.svelte'

  import Graphics from '$components/Graphics.svelte'

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

    Area: string | null
    Types: string | null
    AttributeTypes: string | null
    DateDonated: Date | string | null
    NumHits: number
  }

  export let dataset: Dataset

  // toggle, mostly indicating if this grid is being used on the home page (false)
  // or on its own display/listing page (true)
  export let extraInfo = false

  export let showAll = false

  // image src for the dataset avatar
  $: src =
    dataset?.Graphics != null
      ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
      : '/ml/datasets/default/SmallLarge.jpg'

  import { collapse } from '$lib/actions'
  export let open = false

  const toggleOpen = () => {
    open = !open
  }

  $: open = showAll
</script>

<div class="flex flex-col gap-2">
  <!-- title slot of the accordion is any content that's displayed when closed -->
  <div class="hover:bg-base-200 p-2 rounded-lg" on:click={toggleOpen}>
    <!-- two different avatars are actually on the page; they are hidden/visible at different media queries -->
    <!-- Avatar that will appear to the left of the row when screen is larger -->
    <div class="grid grid-cols-12 items-center">
      <div class="hidden sm:flex avatar col-span-1 self-center justify-self-center">
        <div class="mask mask-squircle w-12 h-12 flex align-center">
          <Graphics {src} alt="dataset-graphic-small-screen" />
        </div>
      </div>

      <!-- abstract will show up always if there isn't extra info present -->
      <div class="col-span-11 gap-5 ml-4">
        <div class="flex flex-col">
          <h1 class="text-primary break-word underline">
            <a
              href="/dataset/{dataset.ID}/{dataset.slug}"
              class="btn btn-ghost h-full text-xl -ml-4"
              on:click|stopPropagation
            >
              {dataset.Name}
            </a>
          </h1>

          <!-- Avatar that will appear under the title when screen is small -->
          <!-- in a flex container with the name to account for long names/overflowing -->
          <div class="sm:hidden avatar col-span-1 w-full my-2 self-center justify-center">
            <div class="mask mask-squircle w-12 h-12 flex align-center">
              <Graphics {src} alt="dataset-graphic-small-screen" />
            </div>
          </div>
        </div>
        <h2 class="my-4 line-clamp-3 break-word overflow-x-hidden" class:md:hidden={extraInfo}>
          {dataset.Abstract}
        </h2>

        <!-- preview icons, each take up equal space in a 9 or 12 column grid -->
        <!-- show 3 icons on home page when there's no extra info; 4 icons on dataset listing page -->
        <div class="hidden md:grid {extraInfo ? 'grid-cols-12' : 'grid-cols-9'} gap-4 my-2">
          <div class="col-span-3 flex gap-2">
            <ClipboardIcon />
            {dataset.Task}
          </div>

          <!-- show Types if there is additional info at the bottom -->
          {#if extraInfo}
            <div class="col-span-3 flex gap-2">
              <ClipboardIcon />
              {dataset.Types}
            </div>
          {/if}

          <div class="col-span-3 flex gap-2">
            <ColumnsIcon />
            {dataset?.NumInstances
              ? AbbrevNum.format(dataset.NumInstances) + '  Instances'
              : 'N/A'}
          </div>
          <div class="col-span-3 flex gap-2">
            <RowsIcon />
            {dataset?.NumAttributes
              ? AbbrevNum.format(dataset.NumAttributes) + '  Attributes'
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- conent slot of the accordion is content that's displayed only when open -->
  <!-- extra info, e.g. collapsible content only appears on the dataset listing page -->
  {#if extraInfo}
    <div use:collapse={{ open, baseHeight: 0 }} class="overflow-hidden h-0 px-4">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <!-- override default daisyUI sticky positioning of left column -->
              <th class="bg-secondary" style="position: relative">Subject Area</th>
              <th class="bg-secondary">Attribute Type</th>
              <th class="bg-secondary">Date Donated</th>
              <th class="bg-secondary"># Views</th>
            </tr>
          </thead>
          <tbody>
            <!-- additional information in a table -->
            <tr>
              <td>{dataset.Area ?? 'N/A'}</td>
              <td>{dataset.AttributeTypes ?? 'N/A'}</td>
              <td
                >{dataset.DateDonated
                  ? new Date(dataset.DateDonated).toLocaleDateString('en-US')
                  : 'N/A'}</td
              >
              <td>{AbbrevNum.format(dataset.NumInstances || 0)}</td>
            </tr>
          </tbody>
        </table>
        <p class="my-4 break-word overflow-x-hidden">
          {dataset.Abstract}
        </p>
      </div>
    </div>
  {/if}
</div>

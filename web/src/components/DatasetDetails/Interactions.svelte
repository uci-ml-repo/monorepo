<script lang="ts">
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import EyeIcon from '$components/Icons/Eye.svelte'
  import QuoteIcon from '$components/Icons/Quote.svelte'
  import CopyToClipboard from '$components/CopyToClipboard.svelte'

  import { clickOutside } from '$lib/actions'

  export let ID = 0

  // query for the dataset to display citations and views
  //////////////////////////////////////////
  const datasetQuery = useQuery(
    ['donated_datasets.byId', ID],
    async () => await trpc(fetch).query('donated_datasets.getById', ID)
  )

  // query for the citations for the cite modal
  //////////////////////////////////////////
  const citationQuery = useQuery(
    ['citation.getCitation', ID],
    async () => await trpc(fetch).query('citation.getCitation', ID)
  )

  $: dataset = $datasetQuery.data
  $: bibtex = $citationQuery?.data?.bibtexText
  $: citation = $citationQuery?.data?.citationText

  // modal controls
  //////////////////////////////////////////
  let citeModalOpen = false

  const openCiteModal = () => (citeModalOpen = true)
  const closeCiteModal = () => (citeModalOpen = false)
</script>

<div class="flex flex-col gap-4">
  <!-- link to downloads page or home page -->
  <a href={dataset?.href} target="_blank" class="btn btn-primary w-full text-white">
    {dataset?.URLLink ? 'Home Page' : 'View Downloads'}
  </a>

  <!-- cite modal; copy to clipboard citation -->
  {#if dataset?.URLLink == null}
    <button class="btn btn-secondary w-full text-black" on:click={openCiteModal}>Cite</button>
  {/if}
  <div>
    <!-- number of citations -->
    {#if dataset?.NumPapers}
      <div class="flex gap-3 items-center">
        <QuoteIcon class="fill-primary" />
        <span class="text-primary font-semibold"
          >{dataset?.NumPapers + ' citations' || 'N/A'}</span
        >
      </div>
    {/if}

    <!-- number of views -->
    {#if dataset?.NumHits}
      <div class="flex gap-3 items-center ">
        <EyeIcon class="fill-primary" />
        <span class="text-primary font-semibold">{dataset.NumHits} views</span>
      </div>
    {/if}
  </div>
  <div />
</div>

<!-- modal for copying citations to clipboard -->
<div class="modal" class:modal-open={citeModalOpen}>
  <div class="modal-box relative" use:clickOutside on:outside_click={closeCiteModal}>
    <div class="flex flex-col gap-4">
      <!-- regular citation copy to clipboard -->
      <CopyToClipboard value={citation}>
        <span class="text text-primary font-semibold">Citation</span>
      </CopyToClipboard>

      <!-- bibtex copy to clipboard -->
      <CopyToClipboard value={bibtex}>
        <span class="text text-primary font-semibold">BibTeX</span>
      </CopyToClipboard>
    </div>
  </div>
</div>

<script lang="ts">
  export let ID = 0
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import EyeIcon from '$components/Icons/Eye.svelte'
  import QuoteIcon from '$components/Icons/Quote.svelte'
  import CopyToClipboard from '$components/CopyToClipboard.svelte'

  const datasetQuery = useQuery(
    ['donated_datasets.byId', ID],
    async () => await trpc(fetch).query('donated_datasets.getById', ID)
  )

  const citationQuery = useQuery(
    ['citation.getCitation', ID],
    async () => await trpc(fetch).query('citation.getCitation', ID)
  )

  $: dataset = $datasetQuery.data
  $: bibtex = $citationQuery?.data?.bibtexText
  $: citation = $citationQuery?.data?.citationText
</script>

<div class="flex flex-col gap-4">
  <a href={dataset?.href} target="_blank" class="btn btn-primary w-full text-white">
    {dataset?.URLLink ? 'Home Page' : 'View Downloads'}
  </a>
  {#if dataset?.URLLink == null}
    <label for="my-modal" class="btn btn-secondary w-full text-black">Cite</label>
  {/if}
  <div>
    {#if dataset?.NumPapers}
      <div class="flex gap-3 items-center">
        <QuoteIcon class="fill-primary" />
        <span class="text-primary font-semibold"
          >{dataset?.NumPapers + ' citations' || 'N/A'}</span
        >
      </div>
    {/if}
    {#if dataset?.NumHits}
      <div class="flex gap-3 items-center ">
        <EyeIcon class="fill-primary" />
        <span class="text-primary font-semibold">{dataset.NumHits} views</span>
      </div>
    {/if}
  </div>
  <div />
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal" class="modal-toggle" />
<label for="my-modal" class="modal cursor-pointer">
  <label class="modal-box relative" for="not-actually-for-anything">
    <div class="flex flex-col gap-4">
      <CopyToClipboard value={citation}>
        <span class="text text-primary font-semibold"> Citation </span>
      </CopyToClipboard>
      <CopyToClipboard value={bibtex}>
        <span class="text text-primary font-semibold"> BibTeX </span>
      </CopyToClipboard>
    </div>
  </label>
</label>

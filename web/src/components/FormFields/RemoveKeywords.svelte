<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import Autocompletev2 from '$components/Autocompletev2.svelte'

  export let ID = 0

  // get existing keywords for the dataset for autocomplete
  const existingKeywordQuery = useQuery(
    ['keywords.getDatasetKeywords', ID],
    async () => await trpc(fetch).query('keywords.getDatasetKeywords', ID)
  )

  // existing keywords needs to be array { label, value } objects
  // where the label is displayed, but the form data collects the value (keyword ID)
  $: existingKeywordOptions =
    $existingKeywordQuery?.data?.map((k) => ({
      label: k.keywords.keyword,
      value: k.keywordsID,
    })) || []

  // bind to this value to select multiple options
  export let selectedValues: number[] = []
</script>

<label for="keyword-remove-autocomplete">
  <span class="text-lg">Keywords to Remove</span>
  <Autocompletev2 bind:selectedValues options={existingKeywordOptions} multiple />
</label>

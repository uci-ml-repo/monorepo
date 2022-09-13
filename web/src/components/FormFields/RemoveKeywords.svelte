<script lang="ts">
  /*
     given a dataset ID, a keyword remove field uses a multi-select autocomplete
     form to collect the ID of keywords to remove for a dataset
     the parent form should bind to the "selectedValues" to view the IDs selected

     ** there is not yet a way for this component to persist its values
   */

  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import Autocompletev2 from '$components/Autocompletev2.svelte'

  export let ID = 0

  // bind to this value to select multiple options
  export let selectedValues: number[] = []

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
</script>

{#key existingKeywordOptions}
  <label for="keyword-remove-autocomplete" class="flex flex-col gap-4">
    <span class="text-lg">Keywords to Remove</span>
    <Autocompletev2 bind:selectedValues options={existingKeywordOptions} multiple />
  </label>
{/key}

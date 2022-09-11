<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'
  import Autocompletev2 from '$components/Autocompletev2.svelte'

  // get all keywords for the dataset for autocomplete
  const allKeywordQuery = useQuery(
    ['keywords.getNames'],
    async () => await trpc(fetch).query('keywords.getNames')
  )

  // keyword options for autocomplete
  $: allKeywordOptions = $allKeywordQuery?.data || []

  // bind to this value to select multiple options
  export let selectedValues: string[] = []
</script>

<label for="keyword-add-autocomplete">
  <span class="text-lg">Keywords to Add</span>
  <Autocompletev2 bind:selectedValues options={allKeywordOptions} multiple freeSolo />
</label>

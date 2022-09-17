<script lang="ts">
  /*
     a keyword add field uses a multi-select autocomplete form to select
     keyword strings from the list of all approved keywords
     the parent form should bind to the "selectedValues" to view the keyword strings selected
     freeSolo also allows the user to enter a custom keyword and hit Enter to submit
   */

  // bind to this value to select multiple options
  export let selectedValues: string[] = []

  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'
  import Autocomplete from '$components/Inputs/Autocomplete.svelte'

  // get all keywords for the dataset for autocomplete
  const allKeywordQuery = useQuery(
    ['keywords.getNames'],
    async () => await trpc(fetch).query('keywords.getNames')
  )

  // keyword options for autocomplete
  $: allKeywordOptions = $allKeywordQuery?.data || []
</script>

{#key allKeywordOptions}
  <label for="keyword-add-autocomplete" class="flex flex-col gap-4">
    <span class="text-lg">Keywords to Add</span>
    <Autocomplete
      bind:selected={selectedValues}
      options={allKeywordOptions}
      multiple
      freeSolo
    />
  </label>
{/key}

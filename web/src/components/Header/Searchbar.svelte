<script lang="ts">
  import { clickOutside } from '$lib/actions'

  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import SearchIcon from '$components/Icons/Search.svelte'

  import VirtualList from '$components/UI/VirtualList.svelte'

  // typed input
  let search = ''

  // parent can bind to the open value
  export let open = false

  // is searching will respond to the length of search string, but also to radio buttons
  $: if (search.length) {
    openSearch()
  }

  // controls (for readability)
  //////////////////////////////////////////
  const openSearch = () => (open = true)
  const closeSearch = () => (open = false)

  // search results
  //////////////////////////////////////////
  const nameResult = useQuery(
    'donated_datasets.getNames',
    async () => await trpc(fetch).query('donated_datasets.getNames')
  )

  const keywordResult = useQuery(
    'keywords.getNames',
    async () => await trpc(fetch).query('keywords.getNames')
  )

  // use search type to determine which options to show
  let searchType = 'names'

  // autocomplete options is reactive to the search type as well as the queries
  $: autocompleteOptions = searchType === 'keywords' ? keywords : names
  $: keywords = $keywordResult.data || []
  $: names = $nameResult.data || []
</script>

<div
  class={`w-full ml-auto lg:max-w-sm input input-sm input-bordered border-primary rounded-full`}
  use:clickOutside
  on:outside_click={closeSearch}
>
  <!-- this div is slightly smaller than the outer div -->
  <div class="relative w-full h-full flex justify-end my-auto">
    <!-- search input -->
    <input
      type="text"
      class="w-full outline-none bg-transparent"
      bind:value={search}
      on:click={openSearch}
      aria-label="search-input"
    />
    <!-- search icon button -->
    <button class="btn btn-ghost btn-circle btn-sm" aria-label="toggle sidebar">
      <SearchIcon class="h-5" />
    </button>

    <!-- dropdown menu -->
    <div
      tabindex="0"
      class="absolute w-full top-full collapse border-base-300 border-t-primary bg-base-100"
      class:collapse-open={open}
      class:border={open}
    >
      <!-- radio buttons to search by name or keyword -->
      <div class="collapse-content p-0">
        <div class="p-2 flex justify-evenly flex-wrap">
          <!-- name radio button -->
          <label class="label cursor-pointer flex gap-3">
            <span class="label-text">Name</span>
            <input
              type="radio"
              class="radio checked:bg-primary"
              bind:group={searchType}
              value="names"
            />
          </label>

          <!-- keywords radio button -->
          <label class="label cursor-pointer flex gap-3">
            <span class="label-text">Keyword</span>
            <input
              type="radio"
              class="radio checked:bg-primary"
              bind:group={searchType}
              value="keywords"
            />
          </label>
        </div>

        <div class="divider m-0" />

        <!-- virtual list that displays all the matching options -->
        <VirtualList height="240px" items={autocompleteOptions} let:item>
          <a href="/" on:click={() => (search = item)}>
            {item}
          </a>
        </VirtualList>
      </div>
    </div>
  </div>
</div>

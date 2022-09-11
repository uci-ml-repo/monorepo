<script lang="ts">
  import Table from '$components/Table.svelte'
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'
  import Pagination from '$components/Pagination.svelte'

  export let ID = 0

  // query for existing attributes
  //////////////////////////////////////////
  const featuresQuery = useQuery(
    ['attributes.getAttributes', ID],
    async () => await trpc(fetch).query('attributes.getAttributes', ID)
  )

  // all attributes currently associated with dataset
  $: originalData = $featuresQuery?.data?.data || []

  // attributes currently being displayed
  $: data =
    $featuresQuery.data?.data?.slice(
      currentPage * rowsPerPage,
      currentPage * rowsPerPage + rowsPerPage
    ) || []

  // get the headers from the query
  $: headers = $featuresQuery.data?.headers || []

  // pagination controls
  //////////////////////////////////////////
  let currentPage = 0
  let rowsPerPage = 10
</script>

<div>
  {#if !data.length}
    <p class="text-xl">N/A</p>
  {:else}
    <div>
      <Table {headers} {data} />
      <Pagination bind:currentPage bind:rowsPerPage data={originalData} />
    </div>
  {/if}
</div>

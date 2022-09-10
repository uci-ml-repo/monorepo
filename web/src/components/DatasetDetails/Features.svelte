<script lang="ts">
  import Table from '$components/Table.svelte'
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'
  import Pagination from '$components/Pagination.svelte'

  export let ID = 0

  const featuresQuery = useQuery(
    ['attributes.getAttributes', ID],
    async () => await trpc(fetch).query('attributes.getAttributes', ID)
  )

  $: originalData = $featuresQuery?.data?.data || []
  $: data =
    $featuresQuery.data?.data?.slice(
      currentPage * rowsPerPage,
      currentPage * rowsPerPage + rowsPerPage
    ) || []
  $: headers = $featuresQuery.data?.headers || []

  let currentPage = 0
  let rowsPerPage = 10
</script>

<div class="py-4">
  {#if !data.length}
    <p class="text-xl">N/A</p>
  {:else}
    <div>
      <Table {headers} {data} />
      <Pagination bind:currentPage bind:rowsPerPage data={originalData} />
    </div>
  {/if}
</div>

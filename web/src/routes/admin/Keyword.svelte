<script lang="ts">
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import Keyword from '$components/Admin/Keyword.svelte'

  import Pagination from '$components/UI/Pagination.svelte'

  const query = useQuery(
    'keywords.getNames',
    async () => await trpc(fetch).query('keywords.getNames')
  )

  $: keywords = $query.data || []

  let currentPage = 0
  let rowsPerPage = 10
</script>

<div class="overflow-x-auto mx-auto p-4">
  <table class="table w-full border">
    <tr>
      <th width="50%">Action</th>
      <th width="50%">Keyword</th>
    </tr>
    {#each keywords.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage) as keyword}
      <Keyword {keyword} />
    {/each}
  </table>
  <Pagination data={keywords} bind:rowsPerPage bind:currentPage />
</div>

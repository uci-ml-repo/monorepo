<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import Pagination from '$components/UI/Pagination.svelte'

  import User from '$components/Admin/User.svelte'

  const query = useQuery(['users.getAll'], async () => {
    return await trpc(fetch).query('users.getAll')
  })

  $: users = $query.data || []

  let currentPage = 0
  let rowsPerPage = 10
</script>

<div class="overflow-x-auto mx-auto p-4">
  <table class="table w-full border">
    <tr>
      <th width="30%">Email</th>
      <th width="35%">Name</th>
      <th width="15%">Role</th>
      <th width="30%">Assign New Role</th>
    </tr>
    {#each users.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage) as user}
      <User {user} />
    {/each}
  </table>
  <Pagination data={users} bind:rowsPerPage bind:currentPage />
</div>

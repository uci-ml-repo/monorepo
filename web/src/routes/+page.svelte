<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  // query for a welcome message from the tRPC server
  const messageQuery = useQuery('/', async () => await trpc(fetch).query('test'))
</script>

<!-- display the data from the query store as the welcome message -->
<p>{$messageQuery.data}</p>

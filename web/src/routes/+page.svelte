<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import About from '$markdown/About.svx'

  // query for a welcome message from the tRPC server
  const messageQuery = useQuery('/', async () => await trpc(fetch).query('test'))
</script>

<About />
<p class="bg-primary btn btn-accent">{$messageQuery.data}</p>

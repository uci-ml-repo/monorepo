<script lang="ts">
  import Spreadsheet from '$components/Spreadsheet/Spreadsheet.svelte'
  import { useQuery, useQueryClient } from '@sveltestack/svelte-query'
  import trpcClient from '$lib/trpc'
  import trpc from '$lib/trpc'

  const queryClient = useQueryClient()

  //query for keywords of a database with ID=610
  // const queryResult = useQuery('getDatasetKeywords', async () => {
  //   const result = trpcClient(fetch).query('keywords_router.getDatasetKeywords', 610)
  //   console.log(result)
  //   return result
  // })

  //query for descriptive question of database with ID=610
  // const queryResult = useQuery('getDescriptive', async () => {
  //   const result = trpcClient(fetch).query('descriptive_router.getDescriptive', 610)
  //   console.log(result)
  //   return result
  // })

  //query for descriptiveQA of database with ID=610
  const queryResult = useQuery('getDescriptive', async () => {
    const result = trpcClient(fetch).query('descriptive_router.getDescriptiveQA', 610)
    console.log(result)
    return result
  })

  const namesQuery = useQuery(
    'getKeywords',
    async () => await trpcClient(fetch).query('keywords_router.getKeywords')
  )
</script>

<svelte:head>
  <title>UC Irvine Machine Learning Repository</title>
</svelte:head>

<h1 class="text-3xl text-primary text-center">
  Welcome to the UC Irvine Machine Learning Repository
</h1>

<Spreadsheet />
{$queryResult.data}

import { queryClient } from '$lib/query'
import trpcClient from '$lib/trpc'
import type { Load } from '@sveltejs/kit'

export const load: Load = async ({ fetch }) => {
  const datasets = await queryClient.fetchQuery(
    'datasets',
    async () =>
      await trpcClient(fetch).query('donated_datasets.getDatasets', {
        order: 'NumHits',
        sort: 'desc',
      })
  )

  const count = await queryClient.fetchQuery(
    'datasetCount',
    async () => await trpcClient(fetch).query('donated_datasets.getCount')
  )

  return {
    datasets,
    count,
  }
}

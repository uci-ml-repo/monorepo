import { queryClient } from '$lib/query'
import trpcClient from '$lib/trpc'
import type { Load } from '@sveltejs/kit'

export const load: Load = async ({ fetch }) => {
  const newDatasets = await queryClient.fetchQuery(
    'newDatasets',
    async () =>
      await trpcClient(fetch).query('donated_datasets.getDatasets', {
        order: 'DateDonated',
        limit: 6,
        sort: 'desc',
      })
  )

  const popularDatasets = await queryClient.fetchQuery(
    'popularDatasets',
    async () =>
      await trpcClient(fetch).query('donated_datasets.getDatasets', {
        order: 'NumHits',
        limit: 6,
        sort: 'desc',
      })
  )

  const count = await queryClient.fetchQuery(
    'popularDatasets',
    async () => await trpcClient(fetch).query('donated_datasets.getCount')
  )

  return {
    newDatasets,
    popularDatasets,
    count,
  }
}

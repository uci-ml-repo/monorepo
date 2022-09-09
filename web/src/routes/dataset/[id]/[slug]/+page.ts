import { queryClient } from '$lib/query'
import trpcClient from '$lib/trpc'
import { redirect } from '@sveltejs/kit'
import type { InferQueryOutput } from '$lib/trpc'

import type { PageLoad } from './$types'

// assert that it's the inferred type (i.e. a dataset) but non-null
// since a redirect will occur if it's invalid
type DatasetProps = Exclude<InferQueryOutput<'donated_datasets.getById'>, null>

export const load: PageLoad<DatasetProps> = async ({ params, fetch }) => {
  const id = parseInt(params.id || '')

  // if id is null, throw a redirect
  if (id == null) {
    throw redirect(307, '/login')
  }

  // attempt to retrieve the dataset
  const dataset = await queryClient.fetchQuery(
    ['dataset', id],
    async () => await trpcClient(fetch).query('donated_datasets.getById', id)
  )

  // if dataset doesn't exist, throw a redirect
  if (dataset == null) {
    throw redirect(307, '/login')
  }

  return {
    ...dataset,
  }
}

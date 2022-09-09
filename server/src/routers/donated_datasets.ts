import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const donatedDatasetsRouter = trpc
  .router<Context>()

  // return an array of approved dataset names
  ////////////////////////////////////////////
  .query('getNames', {
    async resolve({ ctx: { database_services } }) {
      return await database_services.donated_datasets.getNames()
    },
  })

  // return an array of dataset objects matching any input parameters
  ////////////////////////////////////////////
  .query('getDatasets', {
    input: z
      .object({
        // limit the order options for now
        order: z.enum(['NumHits', 'DateDonated']).optional(),

        sort: z.enum(['asc', 'desc']).optional(),
        limit: z.number().optional(),
      })
      .optional(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.donated_datasets.getDatasets(input)
    },
  })

  // return the number of approved datasets
  ////////////////////////////////////////////
  .query('getCount', {
    async resolve({ ctx: { database_services } }) {
      return await database_services.donated_datasets.getCount()
    },
  })


  .query('searchDatasets', {
    async resolve({ input, ctx: { database_services } }) {
      const fakeInput = {
        attribute_type: 'Mixed',
        type: 'Tabular',
        num_attributes: '10',
        num_instances: '10',
        subject_area: ['Computer Science', 'Law'],
        task: 'Classification',
      }
      const result = await database_services.donated_datasets.searchDatasets(fakeInput)
      console.log(result)
      return result

  // given an ID, return the dataset
  ////////////////////////////////////////////
  .query('getById', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.donated_datasets.getById(input)

    },
  })

export default donatedDatasetsRouter

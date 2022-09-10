import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const checkIfEmpty = (val: unknown) => {
  return val == null || val === ''
}

const attributesRouter = trpc
  .router<Context>()

  // given a dataset ID, return an object represent descriptive questions/answers
  ////////////////////////////////////////////
  .query('getDescriptive', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return database_services.descriptive.getDescriptive(input)
    },
  })

  // given a dataset ID, return an array of question/answer tuples
  ////////////////////////////////////////////
  .query('getDescriptiveQA', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return database_services.descriptive.getDescriptiveQA(input)
    },
  })
  .query('getFeatures', {
    input: z.number(),
    async resolve({ input, ctx: { prisma } }) {
      const AttributeHeaders = [
        { key: 0, label: 'Attribute Name' },
        { key: 1, label: 'Role' },
        { key: 2, label: 'Type' },
        { key: 3, label: 'Description' },
        { key: 4, label: 'Units' },
        { key: 5, label: 'Missing Values' },
      ]
      const dataset = await prisma.donated_datasets.findFirst({
        where: {
          ID: input,
        },
        select: {
          attributes: true,
        },
      })
      const attributes =
        dataset?.attributes.map((attribute) => [
          {
            label: checkIfEmpty(attribute.name) ? 'N/A' : attribute.name,
            value: attribute.name,
          },
          {
            label: checkIfEmpty(attribute.role) ? 'N/A' : attribute.role,
            value: attribute.role,
          },
          {
            label: checkIfEmpty(attribute.type) ? 'N/A' : attribute.type,
            value: attribute.type,
          },
          {
            label: checkIfEmpty(attribute.description) ? 'N/A' : attribute.description,
            value: attribute.description,
          },
          {
            label: checkIfEmpty(attribute.units) ? 'N/A' : attribute.units,
            value: attribute.units,
          },
          {
            label: checkIfEmpty(attribute.missingValues)
              ? 'N/A'
              : attribute.missingValues
              ? 'True'
              : 'False',
            value: attribute.missingValues,
          },
        ]) || []
      return { headers: AttributeHeaders, data: attributes }
    },
  })

export default attributesRouter

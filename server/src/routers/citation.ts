import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const joinWithCommasAnd = (items: string[], and = 'and') => {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  return items.slice(0, items.length - 1).join(', ') + ` ${and} ` + items[items.length - 1]
}

export default trpc.router<Context>().query('getCitation', {
  input: z.number(),
  async resolve({ input, ctx: { prisma } }) {
    const dataset = await prisma.donated_datasets.findFirst({
      where: {
        ID: input,
      },
      include: {
        evals: true,
        dataset_papers_dataset_papers_datasetIDTodonated_datasets: true,
        attributes: true,
        dataset_creators: {
          include: {
            creators: true,
          },
        },
      },
    })

    if (!dataset) {
      return
    }
    const creators = dataset.dataset_creators.map(
      (dataset_creator) => dataset_creator.creators
    )

    const creatorArray = []
    for (const creator of creators)
      creatorArray.push(`${creator.lastName}, ${creator.firstName}`)
    const authors = joinWithCommasAnd(creatorArray, '&')

    // todo: change to dataset date created, not dataset date donated
    let year = null
    if (dataset.DateDonated) year = new Date(dataset.DateDonated).getFullYear()

    let doi = null
    if (dataset.DOI) {
      const query_index = dataset.DOI.indexOf('doi.org')
      if (query_index > -1 && dataset.DOI.length > query_index + 8) {
        doi = dataset.DOI.slice(query_index + 8)
      } else {
        doi = dataset.DOI
      }
    }

    // copy-paste citation
    const citation = []
    if (authors.length > 0) {
      citation.push(authors)
    } else {
      citation.push(dataset.Name)
    }
    if (year) citation.push(`(${year})`)
    if (authors.length > 0) citation.push(dataset.Name)
    citation.push('UCI Machine Learning Repository')
    if (doi) citation.push(`https://doi.org/${doi}`)
    const citationText = citation.join('. ') + '.'

    // bibtex citation
    const bibtex = []
    bibtex.push(`misc_${dataset.Name.toLowerCase().replace(/ /g, '_')}_${dataset.ID}`)
    if (authors.length > 0) bibtex.push(`  author       = {${authors}}`)
    bibtex.push(`  title        = {{${dataset.Name}}}`)
    if (year) bibtex.push(`  year         = {${year}}`)
    bibtex.push('  howpublished = {UCI Machine Learning Repository}')
    if (doi) bibtex.push(`  note         = {{DOI}: \\url{${doi}}}`)
    const bibtexText = '@misc{' + bibtex.join(',\n') + '\n}'

    return {
      citationText,
      bibtexText,
    }
  },
})

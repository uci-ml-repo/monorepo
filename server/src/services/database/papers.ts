import { PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

class PapersService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // return an array of all foreign and native papers
  ////////////////////////////////////////////
  async getAll(datasetID: number) {
    const all_papers = await this.prisma.dataset_papers.findMany({
      where: {
        datasetID,
      },
      select: {
        foreign_papers: true,
        native_papers: true,
      },
    })

    // each dataset paper is an object with native_papers and foreign_papers properties that can be null
    // (a dataset paper is of either, mutually exclusive type)
    // to get an array of all papers, get the non-null option from each object
    return all_papers.map(
      (dataset_paper) => dataset_paper.native_papers || dataset_paper.foreign_papers
    )
  }

  // return an array of all foreign and native papers in a summary, e.g.
  // title
  ////////////////////////////////////////////
  async getAllSummary(datasetID: number) {
    const all_papers = await this.prisma.dataset_papers.findMany({
      where: {
        datasetID,
      },
      select: {
        foreign_papers: true,
        native_papers: true,
      },
    })

    // each dataset paper is an object with native_papers and foreign_papers properties that can be null
    // (a dataset paper is of either, mutually exclusive type)
    // to get an array of all papers, get the non-null option from each object
    return (
      all_papers
        .map((dataset_paper) => dataset_paper.native_papers || dataset_paper.foreign_papers)

        // each paper should be mapped to three lines of summary and URL
        // that can be used to describe the paper succinctly on the frontend
        .map((paper) => {
          if (!paper) {
            return
          }

          // e.g. By <authors>. <year>
          const people = `${paper.authors?.length > 0 ? `By ${paper.authors}.` : ''} ${
            paper.year || ''
          }`

          // e.g. Published in <venue>: <journal>. DOI: <DOI>
          const publication = `${
            paper.venue ? `Published in ${paper.venue.toLowerCase()}` : ''
          }${paper.journal ? `: ${paper.journal}.` : ''}${
            paper.DOI ? `DOI: ${paper.DOI}` : ''
          }`

          const url =
            paper.URL || paper?.type === 'SEMANTIC_SCHOLAR'
              ? `https://api.semanticscholar.org/CorpusID:${paper.ID}`
              : null

          return {
            title: paper.title,
            people,
            publication,
            url,
          }
        })
    )
  }
}

export default PapersService

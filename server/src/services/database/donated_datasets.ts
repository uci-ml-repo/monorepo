import { Prisma, PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

class DonatedDatasetsService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async getNames() {
    const dataset_names = await this.prisma.donated_datasets.groupBy({
      by: ['Name'],
      where: {
        Status: 'APPROVED',
      },
    })
    return dataset_names.map((d) => d.Name)
  }

  async selectDatasets(
    query: Prisma.donated_datasetsFindManyArgs['where'],
    limit: Prisma.donated_datasetsFindManyArgs['take'],
    filter:
      | Prisma.donated_datasetsFindManyArgs['orderBy']
      | Record<string, Record<string, unknown>>
  ) {
    return await this.prisma.donated_datasets.findMany({
      where: {
        Status: 'APPROVED',
        ...query,
      },
      orderBy: {
        NumHits: 'desc',
      },
      take: limit,
      ...filter,
    })
  }
}

export default DonatedDatasetsService

import { Prisma, PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

interface getDatasetsProps {
  // the controller can request a sort by any valid key
  order?: keyof Prisma.donated_datasetsOrderByWithRelationInput
  limit?: number
  sort?: Prisma.SortOrder
}

class DonatedDatasetsService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // get the names of datasets, e.g. for the searchbar autocomplete
  //////////////////////////////////////////
  async getNames() {
    const dataset_names = await this.prisma.donated_datasets.groupBy({
      by: ['Name'],
      where: {
        Status: 'APPROVED',
      },
    })
    return dataset_names.map((d) => d.Name)
  }

  // get multiple datasets, e.g. to feature on the home page
  // order, e.g. by DateDonated, NumHits, etc.
  // limit: how many to get
  // sort: ascending or descending
  //////////////////////////////////////////
  async getDatasets(args: getDatasetsProps = {}) {
    const { order, sort, limit } = args

    const sortBy = sort ?? 'desc'
    const orderBy = order ? { [order]: sortBy } : {}

    return await this.prisma.donated_datasets.findMany({
      where: {
        Status: 'APPROVED',
      },
      orderBy,
      take: limit,
    })
  }

  // given a datasetID, find the corresponding dataset
  ////////////////////////////////////////////
  async getById(ID: number) {
    return await this.prisma.donated_datasets.findFirst({
      where: {
        ID,
      },
    })
  }

  // count the number of approved datasets, e.g. for the home page Hero content
  //////////////////////////////////////////
  async getCount() {
    return await this.prisma.donated_datasets.count({
      where: {
        Status: 'APPROVED',
      },
    })
  }
}

export default DonatedDatasetsService

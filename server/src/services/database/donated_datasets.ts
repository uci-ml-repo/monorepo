import { Prisma, PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

interface getDatasetsProps {
  // the controller can request a sort by any valid key
  order?: keyof Prisma.donated_datasetsOrderByWithRelationInput
  limit?: number
  sort?: Prisma.SortOrder
}

interface searchDatasetProps {
  attribute_type?: string
  type?: string
  num_attributes?: string
  num_instances?: string
  subject_area?: string[]
  task?: string
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

  // count the number of approved datasets, e.g. for the home page Hero content
  //////////////////////////////////////////
  async getCount() {
    return await this.prisma.donated_datasets.count({
      where: {
        Status: 'APPROVED',
      },
    })
  }

  async searchDatasets(args: searchDatasetProps = {}) {
    return await this.prisma.donated_datasets.findMany({
      where: {
        Status: 'APPROVED',
        // ...(args.attribute_type ? {AttributeTypes: {contains: args.attribute_type}} : {}),
        ...(args.attribute_type == 'Categorical'
          ? { AttributeTypes: 'Categorical' }
          : args.attribute_type == 'Numerical'
          ? { OR: [{ AttributeTypes: 'Integer' }, { AttributeTypes: 'Real' }] }
          : args.attribute_type == 'Mixed'
          ? {
              OR: [
                { AttributeTypes: 'Integer' },
                { AttributeTypes: 'Real' },
                { AttributeTypes: 'Categorical' },
              ],
            }
          : {}),

        // ...(args.type ? {Types: {contains: args.type}} : {}),
        // ...(args.num_attributes ? {NumAttributes: args.num_attributes} : {}),
        // ...(args.num_instances ? {NumInstances: args.num_instances} : {}),
        // ...(args.subject_area ? {Area: {search: args.subject_area.join(' | ')}}: {}),
      },
    })
  }
}

export default DonatedDatasetsService

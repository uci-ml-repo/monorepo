import { Prisma, PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

interface getDatasetsProps {
  // the controller can request a sort by any valid key
  order?: keyof Prisma.donated_datasetsOrderByWithRelationInput
  limit?: number
  sort?: Prisma.SortOrder
}

interface searchDatasetProps {
  Types?: string
  Area?: string[]
  Task?: string
  NumAttributes?: string
  NumInstances?: string
  AttributeTypes?: string
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

  // given search filters from the donated datasets page,
  // return a filtered list of datasets
  ////////////////////////////////////////////
  async searchDatasets(args: searchDatasetProps = {}) {
    return await this.prisma.donated_datasets.findMany({
      where: {
        Status: 'APPROVED',
        //Attribute Types
        ...(args.AttributeTypes == 'Categorical'
          ? { AttributeTypes: 'Categorical' }
          : args.AttributeTypes == 'Numerical'
          ? { OR: [{ AttributeTypes: 'Integer' }, { AttributeTypes: 'Real' }] }
          : args.AttributeTypes == 'Mixed'
          ? {
              OR: [
                { AttributeTypes: 'Integer' },
                { AttributeTypes: 'Real' },
                { AttributeTypes: 'Categorical' },
              ],
            }
          : {}),
        //Characteristics
        ...(args.Types ? { Types: { contains: args.Types } } : {}),
        // Num Attributes
        ...(args.NumAttributes == '0-10'
          ? { NumAttributes: { lte: 10 } }
          : args.NumAttributes == '10-100'
          ? { AND: [{ NumAttributes: { gte: 10 } }, { NumAttributes: { lte: 100 } }] }
          : args.NumAttributes == '100-inf'
          ? { NumAttributes: { gte: 100 } }
          : {}),
        //Num Instances
        ...(args.NumInstances == '0-100'
          ? { NumInstances: { lte: 100 } }
          : args.NumInstances == '100-1000'
          ? { AND: [{ NumInstances: { gte: 100 } }, { NumInstances: { lte: 1000 } }] }
          : args.NumInstances == '1000-inf'
          ? { NumInstances: { gte: 1000 } }
          : {}),
        //Associated Tasks

        //If the task is other, then only select everything that's either not (Classification or
        //Regression or Clustering) or is null,
        ...(args.Task
          ? args.Task == 'Other'
            ? {
                OR: [
                  {
                    NOT: {
                      OR: [
                        { Task: { contains: 'Classification' } },
                        { Task: { contains: 'Regression' } },
                        { Task: { contains: 'Clustering' } },
                      ],
                    },
                  },
                  { Task: null },
                ],
              }
            : args.Task != 'Other'
            ? { Task: { contains: args.Task } }
            : {}
          : {}),
        //Subject Area
        ...(args.Area
          ? args.Area.length > 0
            ? {
                OR: args.Area.map((area) => {
                  if (area == 'Business') {
                    return {
                      OR: [
                        { Area: { contains: 'Business' } },
                        { Area: { contains: 'Financial' } },
                      ],
                    }
                  }
                  if (area == 'Other') {
                    return {
                      OR: [
                        {
                          NOT: {
                            OR: [
                              { Area: { contains: 'Life' } },
                              { Area: { contains: 'Physical' } },
                              { Area: { contains: 'Life' } },
                              { Area: { contains: 'Computer' } },
                              { Area: { contains: 'Engineering' } },
                              { Area: { contains: 'Social' } },
                              { Area: { contains: 'Financial' } },
                              { Area: { contains: 'Business' } },
                              { Area: { contains: 'Game' } },
                              { Area: { contains: 'Law' } },
                            ],
                          },
                        },
                        { Area: null },
                      ],
                    }
                  }
                  return {
                    OR: [{ Area: { contains: area } }, { Area: { in: area.split(' ') } }],
                  }
                }),
              }
            : {}
          : {}),
      },
    })
  }
}

export default DonatedDatasetsService

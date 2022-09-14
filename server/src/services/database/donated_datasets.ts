import { Prisma, PrismaClient } from '@prisma/client'
import type { attributes } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

interface getDatasetsProps {
  // the controller can request a sort by any valid key
  order?: keyof Prisma.donated_datasetsOrderByWithAggregationInput
  limit?: number
  sort?: Prisma.SortOrder
  status?: string
}

interface searchDatasetProps {
  Types?: string
  Area?: string[]
  Task?: string
  NumAttributes?: string
  NumInstances?: string
  AttributeTypes?: string
}

const constants = {
  OLD_WEBSITE_BASE_URL: 'https:/archive.ics.uci.edu',
  API_BASE_URL: 'http://localhost:5173',
}

function getURLForData(
  ID: number,
  URLLink: string | null,
  URLFolder: string | null,
  Status: string | null
) {
  if (URLLink) {
    if (URLLink.startsWith('http')) {
      return URLLink
    } else {
      return 'http://' + URLLink
    }
  } else {
    if (URLFolder == null) {
      return ''
    }
    if (URLFolder.substring(0, 2) == '..') {
      return constants.OLD_WEBSITE_BASE_URL + '/ml' + URLFolder.substring(2)
    }
    return Status === 'APPROVED'
      ? constants.API_BASE_URL + '/static/ml/datasets/' + ID
      : URLFolder.substring(0, 3) == '/ml'
      ? constants.API_BASE_URL + '/static' + URLFolder
      : constants.API_BASE_URL + '/static/ml/datasets-donated/' + ID
  }
}

const getNumAttributes = (allAttributes: attributes[]) =>
  allAttributes.reduce((numFeatures, attribute) => {
    if (attribute.role === 'Feature') numFeatures++
    return numFeatures
  }, 0) || 0

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
    const sortBy = args?.sort ?? 'desc'
    const orderBy = args?.order ? { [args.order]: sortBy } : {}
    const take = args?.limit
    const Status = args?.status ?? 'APPROVED'

    return await this.prisma.donated_datasets.findMany({
      where: {
        Status,
      },
      orderBy,
      take,
      include: {
        users: {
          select: {
            firstName: true,
            lastName: true,
            user: true,
          },
        },
      },
    })
  }

  // given a datasetID, find the corresponding dataset
  ////////////////////////////////////////////
  async getById(ID: number) {
    const dataset = await this.prisma.donated_datasets.findFirst({
      where: {
        ID,
      },
      include: {
        evals: true,
        edits: true,
        dataset_papers_dataset_papers_datasetIDTodonated_datasets: true,
        attributes: true,
      },
    })
    if (!dataset) {
      return
    }

    return {
      ...dataset,
      // properties that don't normally exist or are artificially generated
      NumPapers: dataset.dataset_papers_dataset_papers_datasetIDTodonated_datasets.length,
      NumEvals: dataset.evals.length,
      NumAttributes: getNumAttributes(dataset.attributes),
      NumEdits: dataset.edits.length,
      href: getURLForData(dataset.ID, dataset.URLLink, dataset.URLFolder, dataset.Status),
    }
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

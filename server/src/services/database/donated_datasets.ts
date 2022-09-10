import { Prisma, PrismaClient } from '@prisma/client'
import type { attributes } from '@prisma/client'
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
      DateDonated: dataset.DateDonated?.toLocaleDateString(),
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
        //Characteristics
        ...(args.type ? { Types: { contains: args.type } } : {}),
        // Num Attributes
        ...(args.num_attributes == '0-10'
          ? { NumAttributes: { lte: 10 } }
          : args.num_attributes == '10-100'
          ? { AND: [{ NumAttributes: { gte: 10 } }, { NumAttributes: { lte: 100 } }] }
          : args.num_attributes == '100-inf'
          ? { NumAttributes: { gte: 100 } }
          : {}),
        //Num Instances
        ...(args.num_instances == '0-100'
          ? { NumInstances: { lte: 100 } }
          : args.num_instances == '100-1000'
          ? { AND: [{ NumInstances: { gte: 100 } }, { NumInstances: { lte: 1000 } }] }
          : args.num_instances == '1000-inf'
          ? { NumInstances: { gte: 1000 } }
          : {}),
        //Associated Tasks

        //If the task is other, then only select everything that's either not (Classification or
        //Regression or Clustering) or is null,
        ...(args.task
          ? args.task == 'Other'
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
            : args.task != 'Other'
            ? { Task: { contains: args.task } }
            : {}
          : {}),
        //Subject Area
        //...(args.subject_area ? { Area: { search: args.subject_area.join(' ') } } : {}),
      },
    })
  }
}

export default DonatedDatasetsService

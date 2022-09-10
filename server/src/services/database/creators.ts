import { PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

class CreatorsService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async getByDatasetId(datasetID: number) {
    const dataset_creators = await this.prisma.dataset_creators.findMany({
      where: {
        datasetID,
      },
      select: {
        creators: true,
      },
    })

    if (!dataset_creators) {
      return
    }

    // returns an array of dataset creators with a nested creator object
    // extract the creator object and return the array of creators
    return dataset_creators.map((dataset_creator) => dataset_creator.creators)
  }
}

export default CreatorsService

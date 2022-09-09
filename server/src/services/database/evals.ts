import { PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

class EvalsService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async getByDatasetId(datasetID: number) {
    return await this.prisma.evals.findMany({
      where: {
        datasetID,
      },
      include: {
        models: true,
        metrics: true,
      },
    })
  }
}

export default EvalsService

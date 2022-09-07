import { PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

class KeywordsService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // return an array of accepted keyword names
  ////////////////////////////////////////////
  async getNames() {
    const keywords = await this.prisma.keywords.findMany({
      where: {
        status: 'ACCEPTED',
      },
      distinct: ['keyword'],
    })
    return keywords.map((k) => k.keyword)
  }

  // given a datasetID, return the keywords associated with the dataset
  ////////////////////////////////////////////
  async getDatasetKeywords(input: number) {
    return await this.prisma.dataset_keywords.findMany({
      where: {
        datasetID: input,
      },
      include: {
        keywords: true,
      },
    })
  }
}

export default KeywordsService

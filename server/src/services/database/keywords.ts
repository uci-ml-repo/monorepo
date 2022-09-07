import { PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

class KeywordsService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async getNames() {
    const keywords = await this.prisma.keywords.findMany({
      where: {
        status: 'ACCEPTED',
      },
      distinct: ['keyword'],
    })
    return keywords.map((k) => k.keyword)
  }
}

export default KeywordsService

import { PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

class UsersService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async findAll() {
    return await this.prisma.users.findMany()
  }
}

export default UsersService

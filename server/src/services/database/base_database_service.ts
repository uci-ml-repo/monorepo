import { PrismaClient } from '@prisma/client'

// all other database services will implement the classes dicatated by this base class
// which only requires that it is constructed with a prisma client at the moment
abstract class DatabaseService {
  constructor(readonly prisma: PrismaClient) {}
}

export default DatabaseService

import { PrismaClient } from '@prisma/client'
import DescriptiveService from './descriptive'
import DonatedDatasetsService from './donated_datasets'
import KeywordsService from './keywords'

// abstract database operations into services that can be used by controllers, i.e. tRPC resolvers via context
export default async (prisma: PrismaClient) => {
  return {
    keywords: new KeywordsService(prisma),
    donated_datasets: new DonatedDatasetsService(prisma),
    descriptive: new DescriptiveService(prisma),
  }
}
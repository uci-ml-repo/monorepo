import { PrismaClient } from '@prisma/client'
import DescriptiveService from './descriptive'
import DonatedDatasetsService from './donated_datasets'
import KeywordsService from './keywords'
import EvalsService from './evals'
import AttributesService from './attributes'
import PapersService from './papers'
import CreatorsService from './creators'
import EditsService from './edits'
import NotesService from './notes'
import UsersService from './users'

// abstract database operations into services that can be used by controllers, i.e. tRPC resolvers via context
// the main export of this folder is a function that receives the initialized prisma client
// and returns an object of all the services that abstract the database operations from the resolver

export default async (prisma: PrismaClient) => {
  return {
    keywords: new KeywordsService(prisma),
    donated_datasets: new DonatedDatasetsService(prisma),
    descriptive: new DescriptiveService(prisma),
    evals: new EvalsService(prisma),
    attributes: new AttributesService(prisma),
    papers: new PapersService(prisma),
    creators: new CreatorsService(prisma),
    edits: new EditsService(prisma),
    notes: new NotesService(prisma),
    users: new UsersService(prisma),
  }
}

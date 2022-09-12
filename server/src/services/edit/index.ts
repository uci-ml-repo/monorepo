import { PrismaClient } from '@prisma/client'

import DonatedDatasetsEditService from './donated_datasets'
import DatasetCreatorsEditService from './creators'
import DatasetKeywordsEditService from './keywords'
import DescriptiveQuestionsEditService from './descriptive_questions'
import TabularEditService from './tabular'
import AttributeEditService from './attributes'
import ForeignPapersEditService from './foreign_papers'
import NativePapersEditService from './native_papers'

// this directory exports a function that accepts a prisma client
// returns an initialized object of services,
// the key should correspond to the keys listed in the database -> "tables" table
// ***CHECK the "tables" table TO MAKE SURE THIS IS ACCURATE***
export default async (prisma: PrismaClient) => {
  return {
    1: new DonatedDatasetsEditService(prisma),
    2: new DatasetCreatorsEditService(prisma),
    3: new DatasetKeywordsEditService(prisma),
    4: new DescriptiveQuestionsEditService(prisma),
    5: new TabularEditService(prisma),
    6: new AttributeEditService(prisma),
    7: new ForeignPapersEditService(prisma),
    8: new NativePapersEditService(prisma),
  }
}

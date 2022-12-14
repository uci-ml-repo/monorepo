import { PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

class NotesService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // given a datasetID, return the notes associated with the dataset
  ////////////////////////////////////////////
  async getByDatasetId(datasetID: number) {
    const notes = await this.prisma.dataset_notes.findFirst({
      where: {
        datasetID,
      },
      select: {
        notes: true,
      },
    })
    return notes?.notes
  }

  // return all the dataset notes in the database
  async findAll() {
    return await this.prisma.dataset_notes.findMany({
      where: {
        notes: {
          not: 'null',
        },
      },
      include: {
        donated_datasets: true,
      },
    })
  }
}

export default NotesService

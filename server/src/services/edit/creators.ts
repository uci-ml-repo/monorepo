import { PrismaClient, dataset_creators, edits, Prisma } from '@prisma/client'
import BaseEditService from './base_edit_service'
import { z } from 'zod'

// schemas for validating the input
//////////////////////////////////////////

// if adding multiple creators, must be array of creator objects
const createCreatorSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().nullable(),
    institution: z.string().nullable(),
    address: z.string().nullable(),
  })
  .array()
  .min(1)

// if adding multiple creators, must be array of numbers (creator IDs)
const deleteCreatorSchema = z.number().array().min(1)

// form data will have creators key with either of the above types
const CreatorSchema = z.object({
  creators: createCreatorSchema.or(deleteCreatorSchema),
})

// service will store and perform edits on the dataset_creators and creators tables
//////////////////////////////////////////
class DatasetCreatorsEditService extends BaseEditService<dataset_creators> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // type guard functions for validating the input
  //////////////////////////////////////////

  // validate input for ADDING multiple creators
  validCreateCreatorArray(t: unknown): t is z.TypeOf<typeof createCreatorSchema> {
    return createCreatorSchema.safeParse(t).success
  }

  // validate input for REMOVING multiple creators
  validDeleteCreatorArray(t: unknown): t is z.TypeOf<typeof deleteCreatorSchema> {
    return deleteCreatorSchema.safeParse(t).success
  }

  // validate all the form data from the client
  validCreatorSubmit(t: unknown): t is z.TypeOf<typeof CreatorSchema> {
    return CreatorSchema.safeParse(t).success
  }

  // CRUD Operations
  // **the function called is determined by the controller**
  //////////////////////////////////////////

  // Given a new edit from the client, save it in the database
  async INSERT(newEdit: Prisma.editsCreateArgs['data']): Promise<edits> {
    // validate the data portion of the edit
    this.validCreatorSubmit(newEdit.data)
    return await this.prisma.edits.create({ data: newEdit })
  }

  async UPDATE(editData: edits): Promise<dataset_creators | dataset_creators[]> {
    const { datasetID, data } = editData

    if (!this.validCreateCreatorArray(data)) {
      throw new Error(
        `Invalid data to update creators, expected array of creator objects, received ${JSON.stringify(
          data
        )}`
      )
    }

    return Promise.all(
      data.map(
        async (creator) =>
          await this.prisma.dataset_creators.create({
            data: {
              creators: {
                create: creator,
              },
              donated_datasets: {
                connect: {
                  ID: datasetID,
                },
              },
            },
          })
      )
    )
  }

  async DELETE(editData: edits): Promise<Prisma.BatchPayload> {
    const { data } = editData

    if (!this.validDeleteCreatorArray(data)) {
      throw new Error(
        `Invalid data to update creators, expected array of creator IDs (numbers), received ${JSON.stringify(
          data
        )}`
      )
    }

    // dataset_creators contains a reference to creators table
    // delete all entries that reference these creators
    await this.prisma.dataset_creators.deleteMany({
      where: { creatorID: { in: data } },
    })

    // then delete all referenced creators in the creators table
    const deleted_creators = await this.prisma.creators.deleteMany({
      where: {
        ID: { in: data },
      },
    })

    return deleted_creators
  }
}

export default DatasetCreatorsEditService

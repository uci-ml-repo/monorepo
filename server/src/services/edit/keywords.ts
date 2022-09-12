import { Prisma, PrismaClient, dataset_keywords, edits } from '@prisma/client'
import BaseEditService from './base_edit_service'
import { z } from 'zod'

// schemas for validating the input
//////////////////////////////////////////

// if adding multiple creators, must be array of creator objects
const addKeywordSchema = z.string().array().min(1)

// if adding multiple creators, must be array of numbers (creator IDs)
const deleteKeywordSchema = z.number().array().min(1)

// form data will have creators key with either of the above types
const KeywordSchema = z.object({
  keywords: addKeywordSchema.or(deleteKeywordSchema),
})

class DatasetKeywordsEditService extends BaseEditService<dataset_keywords> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // type guard functions for validating the input
  //////////////////////////////////////////

  // if adding multiple keywords, data will be an array of strings
  validAddKeywordArray(t: unknown): t is z.TypeOf<typeof addKeywordSchema> {
    return addKeywordSchema.safeParse(t).success
  }

  // if deleting multiple keywords, data will be an array of keywordID s
  validDeleteKeywordArray(t: unknown): t is z.TypeOf<typeof deleteKeywordSchema> {
    return deleteKeywordSchema.safeParse(t).success
  }

  validKeywordSubmit(t: unknown): t is z.TypeOf<typeof KeywordSchema> {
    return KeywordSchema.safeParse(t).success
  }

  // before inserting a new edit, perform basic validation on it
  async INSERT(newEdit: Prisma.editsCreateArgs['data']): Promise<edits> {
    const { recordID } = newEdit

    if (recordID != null) {
      try {
        await this.prisma.dataset_keywords.findFirst({
          where: { datasetKeywordsID: recordID },
        })
      } catch (error) {
        throw new Error(
          `Unable to find a dataset_keyword with ID: ${recordID} to record an edit for`
        )
      }
    }

    return await this.prisma.edits.create({ data: newEdit })
  }

  async UPDATE(editData: edits): Promise<dataset_keywords[]> {
    const { data, datasetID } = editData

    if (!this.validAddKeywordArray(data)) {
      throw new Error(
        `Invalid keyword add array, expected array of strings, received: ${JSON.stringify(
          data
        )}`
      )
    }

    // given an array of keyword objects: { keyword: 'string' }[]
    // connect or create a new keyword for each, and then connect it to the dataset
    return Promise.all(
      data.map(
        async (keyword) =>
          await this.prisma.dataset_keywords.create({
            data: {
              keywords: {
                connectOrCreate: {
                  where: {
                    keyword,
                  },
                  create: {
                    keyword,
                  },
                },
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
    const { datasetID, data } = editData

    // type guard to validate the data
    if (!this.validDeleteKeywordArray(data)) {
      throw new Error(
        `Invalid dlete keyword array, expected array of numbers (keyword IDs), received ${JSON.stringify(
          data
        )}`
      )
    }

    // map all the keywords in the data object to an array of numbers
    return await this.prisma.dataset_keywords.deleteMany({
      where: {
        keywordsID: {
          in: data,
        },
        datasetID,
      },
    })
  }
}

export default DatasetKeywordsEditService

import { PrismaClient, descriptive_questions, edits, Prisma } from '@prisma/client'
import BaseEditService from './base_edit_service'

class DescriptiveQuestionsEditService extends BaseEditService<descriptive_questions> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async INSERT(newEdit: Prisma.editsCreateArgs['data']): Promise<edits> {
    const { datasetID } = newEdit

    // should only be able to update descriptive questions of an existing dataset

    try {
      await this.prisma.donated_datasets.findFirst({ where: { ID: datasetID } })
    } catch (error) {
      throw new Error(`Unable to find donated_dataset with ID ${datasetID} to EDIT`)
    }

    return await this.prisma.edits.create({ data: newEdit })
  }

  async UPDATE(editData: edits): Promise<descriptive_questions> {
    const { recordID, data } = editData

    if (!this.isObject(data)) {
      throw new Error(
        `Data provided for descriptive_questions edit is not an object like Record<string, unknown>, e.g. { key: 'value' }`
      )
    }

    try {
      if (recordID == null) {
        throw new Error()
      }

      return await this.prisma.descriptive_questions.update({
        where: { datasetID: recordID },
        data,
      })
    } catch (error) {
      throw new Error(`Unable to find descriptive_question with ID: ${recordID} to UPDATE`)
    }
  }

  async DELETE(editData: edits): Promise<descriptive_questions> {
    const { recordID } = editData
    try {
      if (recordID == null) {
        throw new Error()
      }

      return await this.prisma.descriptive_questions.delete({
        where: { datasetID: recordID },
      })
    } catch (error) {
      throw new Error(`Unable to find descriptive_question with ID: ${recordID} to DELETE`)
    }
  }
}

export default DescriptiveQuestionsEditService

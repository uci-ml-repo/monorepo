import { PrismaClient, foreign_papers, edits, Prisma } from '@prisma/client'
import BaseEditService from './base_edit_service'

class ForeignPapersEditService extends BaseEditService<foreign_papers> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  validPaper(t: unknown): t is Prisma.foreign_papersCreateInput {
    return true
  }

  async INSERT(newEdit: Prisma.editsCreateArgs['data']): Promise<edits> {
    const { recordID } = newEdit

    // if the edit references an existing entry, verify it exists
    if (recordID != null) {
      try {
        await this.prisma.foreign_papers.findFirst({ where: { ID: recordID } })
      } catch (error) {
        throw new Error(
          `Unable to find a foreign_paper with ID: ${recordID} to record an edit for`
        )
      }
    }

    return await this.prisma.edits.create({ data: newEdit })
  }

  async UPDATE(editData: edits): Promise<foreign_papers> {
    const { actionID, recordID, data } = editData

    if (!this.isObject(data)) {
      throw new Error(
        `Data provided for foreign_papers edit is not an object like Record<string, unknown>, e.g. { key: 'value' }`
      )
    }

    if (actionID === 1 && this.validPaper(data)) {
      this.prisma.foreign_papers.create({
        data,
      })
    }

    try {
      if (recordID == null) {
        throw new Error()
      }

      return await this.prisma.foreign_papers.update({
        where: { ID: recordID },
        data,
      })
    } catch (error) {
      throw new Error(`Unable to find foreign_paper with ID: ${recordID} to UPDATE`)
    }
  }

  async DELETE(editData: edits): Promise<foreign_papers> {
    const { recordID } = editData
    try {
      if (recordID == null) {
        throw new Error()
      }

      return await this.prisma.foreign_papers.delete({
        where: { ID: recordID },
      })
    } catch (error) {
      throw new Error(`Unable to find foreign_paper with ID: ${recordID} to DELETE`)
    }
  }
}

export default ForeignPapersEditService

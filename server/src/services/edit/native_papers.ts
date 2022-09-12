import { Prisma, PrismaClient, native_papers, edits } from '@prisma/client'
import BaseEditService from './base_edit_service'

class NativePapersEditService extends BaseEditService<native_papers> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  validPaper(t: unknown): t is Prisma.native_papersCreateInput {
    return true
  }

  // before inserting a new edit, perform basic validation on it
  async INSERT(newEdit: Prisma.editsCreateArgs['data']): Promise<edits> {
    const { recordID } = newEdit

    if (recordID != null) {
      try {
        await this.prisma.native_papers.findFirst({ where: { ID: recordID } })
      } catch (error) {
        throw new Error(
          `Unable to find a native_paper with ID: ${recordID} to record an edit for`
        )
      }
    }

    return await this.prisma.edits.create({ data: newEdit })
  }

  async UPDATE(editData: edits): Promise<native_papers> {
    const { actionID, recordID, data } = editData

    if (!this.isObject(data)) {
      throw new Error(
        `Data provided for native_papers edit is not an object like Record<string, unknown>, e.g. { key: 'value' }`
      )
    }

    if (actionID === 1 && this.validPaper(data)) {
      this.prisma.native_papers.create({
        data,
      })
    }

    try {
      if (recordID == null) {
        throw new Error()
      }

      return await this.prisma.native_papers.update({
        where: { ID: recordID },
        data,
      })
    } catch (error) {
      throw new Error(`Unable to find native_paper with ID: ${recordID} to UPDATE`)
    }
  }

  async DELETE(editData: edits): Promise<native_papers> {
    const { recordID } = editData
    try {
      if (recordID == null) {
        throw new Error()
      }

      return await this.prisma.native_papers.delete({
        where: { ID: recordID },
      })
    } catch (error) {
      throw new Error(`Unable to find native_paper with ID: ${recordID} to DELETE`)
    }
  }
}

export default NativePapersEditService

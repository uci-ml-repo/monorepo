import { PrismaClient, tabular, edits, Prisma } from '@prisma/client'
import BaseEditService from './base_edit_service'

class TabularEditService extends BaseEditService<tabular> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async INSERT(newEdit: Prisma.editsCreateArgs['data']): Promise<edits> {
    const { recordID } = newEdit

    if (recordID != null) {
      try {
        await this.prisma.tabular.findFirst({ where: { datasetID: recordID } })
      } catch (error) {
        throw new Error(`Unable to find a tabular with ID: ${recordID} to record an edit for`)
      }
    }

    return await this.prisma.edits.create({ data: newEdit })
  }

  async UPDATE(editData: edits): Promise<tabular> {
    const { recordID, data } = editData

    if (!this.isObject(data)) {
      throw new Error(
        `Data provided for tabular edit is not an object like Record<string, unknown>, e.g. { key: 'value' }`
      )
    }

    try {
      if (recordID == null) {
        throw new Error()
      }

      return await this.prisma.tabular.update({
        where: { datasetID: recordID },
        data,
      })
    } catch (error) {
      throw new Error(`Unable to find tabular with ID: ${recordID} to DELETE`)
    }
  }

  async DELETE(editData: edits): Promise<tabular> {
    const { recordID } = editData

    try {
      if (recordID == null) {
        throw new Error()
      }

      return await this.prisma.tabular.delete({
        where: { datasetID: recordID },
      })
    } catch (error) {
      throw new Error(`Unable to find tabular with ID: ${recordID} to DELETE`)
    }
  }
}

export default TabularEditService

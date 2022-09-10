import { PrismaClient } from '@prisma/client'
import BaseDatabaseService from './base_database_service'

class EditsService extends BaseDatabaseService {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async getByDatasetId(datasetID: number) {
    const edits = await this.prisma.edits.findMany({
      where: {
        datasetID,
      },
      select: {
        data: true,
        oldData: true,
        edit_actions: true,
        columns: true,
        reviewedAt: true,
        users: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // headers used for the edits table
    const headers = [
      { key: 0, label: 'New Data', width: '30%' },
      { key: 1, label: 'Old Data', width: '30%' },
      { key: 2, label: 'Review Date', width: '20%' },
      { key: 3, label: 'Reviewer', width: '20%' },
    ]

    // map the edits to an array of { label, value } tuples
    const data = edits.map((edit) => [
      {
        label: JSON.stringify(edit.data, null, 2),
        value: JSON.stringify(edit.data, null, 2),
      },
      {
        // data stored in the database is considered a string
        // do this weird workaround until that's resolved
        label: JSON.stringify(JSON.parse(edit.oldData || '{}'), null, 2),
        value: edit.oldData,
      },
      {
        label: edit.reviewedAt ? new Date(edit.reviewedAt).toLocaleString() : '',
        value: edit.reviewedAt ? new Date(edit.reviewedAt).toLocaleString() : '',
      },
      {
        label: edit.users.firstName + edit.users.lastName,
        value: edit.users.firstName + edit.users.lastName,
      },
    ])

    return {
      headers,
      data,
    }
  }
}

export default EditsService

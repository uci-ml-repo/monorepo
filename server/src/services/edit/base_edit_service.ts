// the base edit service is an generic, abstract class that defines
// - the prisma table that it will perform the edits on
//
// - utility methods for child classes, e.g.
//   each edit service should be able to confirm that the data being inserted
//   during an UPDATE is actually an object, like { key: 'value' } and not
//   some random type
//
// - what operations an edit can do, e.g.
//   on the admin dashboard, edits can update a table or delete a row from the table

import { Prisma, PrismaClient, edits } from '@prisma/client'
import { z } from 'zod'

// operations that can be achieved through the editing interface
// all operations can also return null, e.g. if the service doesn't need to do that operation
interface Operations<Table> {
  INSERT: (newEdit: Prisma.editsCreateArgs['data']) => Promise<edits> | null
  UPDATE: (editData: edits) => Promise<Table | Table[] | Prisma.BatchPayload | edits> | null
  DELETE: (editData: edits) => Promise<Table | Table[] | Prisma.BatchPayload | edits> | null

  REJECT: (editData: edits) => Promise<Table | Table[] | Prisma.BatchPayload | edits> | null
}

abstract class BaseEditService<Table> implements Operations<Table> {
  // initialize this service by providing a PrismaClient
  constructor(readonly prisma: PrismaClient) {}

  // in order to insert the data, it's required that it's actually a JSON object
  // since this data is injected directly into the database invocation
  isObject(data: unknown): data is Record<string, unknown> {
    return z.object({}).safeParse(data).success
  }

  // given a new edit, do validation for the respective table
  // before inserting it into the edits table, to be processed later by
  // the UPDATE or DELETE operations
  abstract INSERT(newEdit: Prisma.editsCreateArgs['data']): Promise<edits> | null

  // modify an existing entry in the database by using the data stored in the edits entry
  // if multiple updates are performed, return an array of them
  // if a updateMany is used, then a batchpayload will be returned
  abstract UPDATE(
    editData: edits
  ): Promise<Table | Table[] | Prisma.BatchPayload | edits> | null

  // delete an existing entry in the database by identifying it by its recordID
  // if multiple deletes are performed, return an array of them
  // if a deleteMany is used, then a batchpayload will be returned
  abstract DELETE(
    editData: edits
  ): Promise<Table | Table[] | Prisma.BatchPayload | edits> | null

  // all services will have a default implemented method for rejecting edits
  // child class can override if this behavior needs to be specialized
  async REJECT(editData: edits): Promise<edits> {
    const { ID } = editData
    const rejectedEdit = await this.prisma.edits.update({
      where: {
        ID,
      },
      data: {
        status: 'REJECTED',
      },
    })

    if (!rejectedEdit) {
      throw new Error(`Edit ${ID} not available to reject`)
    }

    return rejectedEdit
  }
}

export default BaseEditService

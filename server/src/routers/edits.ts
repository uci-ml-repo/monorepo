import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

export default trpc
  .router<Context>()

  // return an array of tuples that is used to render the edits table on the client
  // not sure which side should handle this processing atm
  .query('getByDatasetId', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.edits.getByDatasetId(input)
    },
  })
  // insert an edit into the edits table, effectively preserving a CRUD operation
  // that will be performed during the accept step
  .mutation('insert', {
    input: z.object({
      // dataset this effects
      datasetID: z.number(),

      // userID who did the edit
      userID: z.number(),

      // needed to perform the database operation during accept step
      actionID: z.number(), // identify CRUD operation
      tableID: z.number(), // identify table for the operation
      columnID: z.number().optional(), // identify column in the table
      recordID: z.number().optional(), // identify the row via a unique ID/primary key

      // a generic object that will be used to perform the update during accept step
      // validated as empty object that allows any unknown properties
      data: z.union([z.object({}).passthrough(), z.any().array()]),
      oldData: z.string(),

      // reason for doing the edit
      rationale: z.string().optional(),
    }),
    async resolve({ input, ctx: { edit_services } }) {
      // controller will use the tableID to redirect the request to
      // the appropriate edit service
      const tableID = input.tableID as keyof typeof edit_services
      const edited_dataset = await edit_services[tableID].INSERT(input)
      return edited_dataset
    },
  })

  // accept an edit by accessing the data in the edits table and
  // re-creating the CRUD operation
  .mutation('accept', {
    input: z.number(),
    async resolve({ input, ctx: { prisma, edit_services } }) {
      // first, retrive the edit being referenced
      const edit = await prisma.edits.findFirst({
        where: {
          ID: input,
        },
      })

      if (!edit) {
        throw new Error(`Requested edit does not exist: ${JSON.stringify(input)}`)
      }

      const { actionID } = edit

      const edit_action = await prisma.edit_actions.findFirst({
        where: { ID: actionID },
        select: { action: true },
      })

      if (edit_action == null) {
        throw new Error(`Invalid action ID provided`)
      }

      // use the tableID of the edit to redirect the request to the coresponding service
      const tableID = edit.tableID as keyof typeof edit_services

      // use the action to determine which operation to do
      const action = edit_action.action

      switch (action) {
        case 'ADD':
          await edit_services[tableID].UPDATE(edit)
          break
        case 'UPDATE':
          await edit_services[tableID].UPDATE(edit)
          break
        case 'REMOVE':
          await edit_services[tableID].DELETE(edit)
          break
      }
      return await prisma.edits.update({
        where: { ID: input },
        data: { status: 'ACCEPTED', reviewedAt: new Date() },
      })
    },
  })

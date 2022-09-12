import { PrismaClient, attributes, edits, Prisma } from '@prisma/client'
import BaseEditService from './base_edit_service'
import { z } from 'zod'

class AttributeEditService extends BaseEditService<attributes> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // verifies that the data being inserted is a valid 2D string array,
  // with the correct length tuples, etc.
  isValidInsert = (t: unknown): t is z.TypeOf<typeof AttributeInsertSchema> => {
    const columns = Object.keys(Prisma.AttributesScalarFieldEnum).filter(
      (key) => key != 'datasetID'
    )

    const AttributeInsertSchema = z.any().array().length(columns.length).array()

    // ** THIS LINE CAN THROW AN ERROR, e.g. before the one in the outer function **
    // I think it's more informative than the one in the outer function,
    // uncomment if you want to see schema errors
    //AttributeInsertSchema.parse(t)

    return AttributeInsertSchema.safeParse(t).success
  }

  isValidUpdate = (t: unknown): t is z.TypeOf<typeof AttributeUpdateSchema> => {
    // attributes is a special case: each object in the array contains the ID
    // that maps the row to its row in the "attributes" table
    const AttributeUpdateSchema = z
      .object({
        // ID will be empty string if new row, number of existing row otherwise
        ID: z.number(),
        name: z.string(),
        role: z.string().optional(),
        type: z.string(),
        description: z.string().optional(),
        units: z.string().optional(),
        missingValues: z.boolean().optional(),
      })
      .array()

    // ** THIS LINE CAN THROW AN ERROR, e.g. before the one outside **
    // I think it's more informative than the one in the outer function,
    // uncomment if you want to see schema errors
    //AttributeUpdateSchema.parse(t)

    return AttributeUpdateSchema.safeParse(t).success
  }

  isValidDelete(t: unknown): t is z.TypeOf<typeof AttributeDeleteSchema> {
    const AttributeDeleteSchema = z.number().array()

    // ** THIS LINE CAN THROW AN ERROR, e.g. before the one outside **
    // I think it's more informative than the one in the outer function,
    // uncomment if you want to see schema errors
    //AttributeDeleteSchema.parse(t)

    return AttributeDeleteSchema.safeParse(t).success
  }

  async INSERT(newEdit: Prisma.editsCreateArgs['data']): Promise<edits> {
    // if inserting an array of IDs to delete rows, just add them
    if (this.isValidDelete(newEdit.data)) {
      return await this.prisma.edits.create({ data: newEdit })
    }

    if (!this.isValidInsert(newEdit.data)) {
      throw new Error(
        `Invalid data provided for attribute edit, received ${JSON.stringify(newEdit.data)}`
      )
    }

    // take all the columns as keys except for datasetID
    const columns = Object.keys(Prisma.AttributesScalarFieldEnum).filter(
      (key) => key != 'datasetID'
    )

    // now take the array of string arrays and attempt to map it into an object, e.g.
    // [ [10, "Name", "Role", "Type", "Description", "Units", false] ] ->
    // [ { id: 10, name: "Name", role: "Role", type: "Type", description: "Description", "units": "Units", "missingValues": false} ]
    const transformedData = newEdit.data.map((row) =>
      row.reduce(
        (rowObject, cell, i) => ({
          // keep the accumulated row object
          ...rowObject,

          // length of a row and length of columns should match
          // columns[i] = key, i.e. a column name, e.g. "ID", "Role", etc.
          // row[i] = cell is a value that should correspond with the key
          // so e.g. i = 0 -> key=columns[0]="ID" and cell = row[0] = #
          [columns[i]]: cell,
        }),
        {} // initialize rowObject with an empty object
      )
    )
    return await this.prisma.edits.create({ data: { ...newEdit, data: transformedData } })
  }

  // update existing attribute rows
  async UPDATE(editData: edits): Promise<attributes[]> {
    const { datasetID, data } = editData

    if (!this.isValidUpdate(data)) {
      throw new Error(`Invalid attribute array provided, received ${JSON.stringify(data)}`)
    }

    // map all of the data in editData to prisma promises
    // i.e. for every operation enumerated in editData.data,
    // do the operation and add it to the promise array; return the array when done
    return Promise.all(
      data.map(async ({ ID, ...data }) =>
        // ID = -1 is a designated number for new rows, create a new entry if present
        // **weird looking ternary
        ID === -1
          ? await this.prisma.attributes.create({
              data: {
                ...data,
                donated_datasets: {
                  connect: {
                    ID: datasetID,
                  },
                },
              },
            })
          : // if ID !== -1, then the entry exists, and just update the entry
            await this.prisma.attributes.update({
              where: { ID },
              data,
            })
      )
    )
  }

  // delete rows from a table
  async DELETE(editData: edits): Promise<Prisma.BatchPayload> {
    const { data } = editData

    if (!this.isValidDelete(data)) {
      throw new Error(`Invalid data for attribute delete`)
    }

    try {
      return await this.prisma.attributes.deleteMany({
        where: {
          ID: {
            in: data,
          },
        },
      })
    } catch (error) {
      throw new Error(`Unable to delete all attributes with data: ${JSON.stringify(data)}`)
    }
  }
}

export default AttributeEditService

import { Prisma, PrismaClient, donated_datasets, edits } from '@prisma/client'
import BaseEditService from './base_edit_service'
import { z } from 'zod'
import fs from 'fs-extra'

// when graphics is first uploaded, it will be a File converted to an object
const GraphicSchema = z
  .object({
    data: z.string(),
    lastModified: z.number(),
    lastModifiedDate: z.string(),
    name: z.string(),
  })
  .passthrough()

// after the Graphics file has been processed and saved to disk,
// a string representing its file path will replace the object above
// and saved to the database
const FileSchema = z.string()

// a dataset update will contain one or some of these properties
const Schema = z.object({
  Abstract: z.string().optional(),
  Area: z.string().optional(),
  DOI: z.string().nullable().optional(),
  Task: z.string().optional(),
  Types: z.string().optional(),
  Graphics: z.any(),
})

class DonatedDatasetsEditService extends BaseEditService<donated_datasets> {
  // call the base service's constructor to initialize this.prisma
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // type guard functions for validating the input
  //////////////////////////////////////////

  // validate form data submission from user
  validDatasetData(t: unknown): t is z.TypeOf<typeof Schema> {
    return Schema.safeParse(t).success
  }

  // validate initial graphics submission (should be object -> like a File)
  validGraphics(t: unknown): t is z.TypeOf<typeof GraphicSchema> {
    return GraphicSchema.safeParse(t).success
  }

  // validate retrived graphics from database (should be string -> file path)
  validFile(t: unknown): t is z.TypeOf<typeof FileSchema> {
    return FileSchema.safeParse(t).success
  }

  // CRUD operations
  //////////////////////////////////////////

  async INSERT(newEdit: Prisma.editsCreateArgs['data']): Promise<edits> {
    const { datasetID, recordID, data } = newEdit

    if (!this.validDatasetData(data)) {
      throw new Error(
        `Invalid data provided to update dataset, received ${JSON.stringify(data)}`
      )
    }

    if (recordID == null) {
      throw new Error(`Unable to find dataset with ID, ${recordID} to UPDATE`)
    }

    // get existing dataset
    const existing_dataset = await this.prisma.donated_datasets.findFirst({
      where: {
        ID: recordID,
      },
    })

    // entirely separate logic for handling Graphics
    //////////////////////////////////////////
    if (this.validGraphics(data.Graphics)) {
      const baseFilePath =
        existing_dataset?.Status === 'APPROVED' ? 'ml/datasets' : 'ml/datasets-donated'

      const { name, data: imageData } = data.Graphics

      const [, fileData] = imageData.split(';base64,') || []

      //const fileExtension = prefix.split('/')[1]
      //can valididate file extension; extension will be added automatically when
      //writing to the file
      const directory = `${baseFilePath}/${datasetID}/PendingGraphics/`
      const pendingFileName = directory + name

      // make sure directory exists
      fs.mkdirpSync(directory)

      // write the base64 data to a new file
      fs.writeFileSync(directory + name, fileData, 'base64')

      // now that the Graphics object is processed, change the actual edit data
      // to just store the name/file location of the pending graphics file
      newEdit.data = { Graphics: pendingFileName }
    }

    return await this.prisma.edits.create({ data: newEdit })
  }

  // given a recordID referencing an entry in the donated_datasets table
  // update the data for that entry
  async UPDATE(editData: edits) {
    const { datasetID, recordID, data } = editData

    if (!this.validDatasetData(data)) {
      throw new Error(
        `Data provided for donated_datasets edit does not match the schema, got ${JSON.stringify(
          data
        )}`
      )
    }

    if (recordID == null) {
      throw new Error(`Unable to find dataset with ID, ${recordID} to UPDATE`)
    }

    // get existing dataset
    const existing_dataset = await this.prisma.donated_datasets.findFirst({
      where: {
        ID: recordID,
      },
    })

    // separate logic for processing a graphics submission
    if (this.validFile(data.Graphics)) {
      const baseFilePath =
        existing_dataset?.Status === 'APPROVED' ? 'ml/datasets' : 'ml/datasets-donated'

      const directory = `${baseFilePath}/${datasetID}/Graphics/`
      const pendingDirectory = `${baseFilePath}/${datasetID}/PendingGraphics/`
      const backupDirectory = `${baseFilePath}/${datasetID}/SavedGraphics/`

      // make a backup of the current image file
      if (fs.existsSync(directory + 'Large.jpg')) {
        const timestamp = new Date().toLocaleDateString('en-us').replaceAll('/', '-')
        const datestamp = new Date()
          .toLocaleTimeString('en-us', { hour12: false })
          .replaceAll(':', '-')

        // make the backup directory if it doesn't exist
        fs.mkdirpSync(backupDirectory)

        // make a backup, e.g. '6-9-2022_4-20-15.jpg'
        fs.copyFileSync(
          directory + 'Large.jpg',
          backupDirectory + timestamp + '_' + datestamp + '.jpg'
        )
      }

      // make the official graphics directory if it doesn't exist
      fs.mkdirpSync(directory)

      // copy a large version for the individual dataset page
      fs.copyFileSync(data.Graphics, directory + 'Large.jpg')

      // copy a small version for the listing page
      fs.copyFileSync(data.Graphics, directory + 'SmallLarge.jpg')

      // remove the pending directory
      fs.remove(pendingDirectory)

      data.Graphics = directory + 'Large.jpg'
    }

    return await this.prisma.donated_datasets.update({
      where: { ID: recordID },
      data,
    })
  }

  // given a recordID referencing the donated_datasets table,
  // find and delete the corresponding record
  async DELETE(editData: edits) {
    const { recordID } = editData
    if (recordID == null) {
      throw new Error(`Unable to find dataset with ID, ${recordID} to DELETE`)
    }

    return await this.prisma.donated_datasets.delete({
      where: { ID: recordID },
    })
  }
}

export default DonatedDatasetsEditService

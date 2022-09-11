import { z } from 'zod'

const FileSchema = z.object({
  name: z.string(),
  data: z.string(),
  lastModified: z.number(),
})

export type FileType = z.TypeOf<typeof FileSchema>
export default FileSchema

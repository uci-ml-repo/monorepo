// create a number formatter from the Intl library, invocation:
// AbbrevNum.format(123456789)
export const AbbrevNum = new Intl.NumberFormat('en-EN', {
  notation: 'compact',
  maximumFractionDigits: 2,
})

// convert a a file to an object
export const FileToObject = async (file: File): Promise<FileObject> => {
  const data = await readFile(file)

  const fileObject = {
    name: file.name,
    lastModified: file.lastModified,
    data,
  }

  return fileObject
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => {
      const result = fr.result
      if (typeof result === 'string') {
        resolve(result)
      }
    }
    fr.onerror = reject
    fr.readAsDataURL(file)
  })
}

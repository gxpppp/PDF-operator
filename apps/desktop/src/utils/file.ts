export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  return lastDot === -1 ? '' : filename.slice(lastDot + 1).toLowerCase()
}

export function getFileName(path: string): string {
  const separator = path.includes('/') ? '/' : '\\'
  const parts = path.split(separator)
  return parts[parts.length - 1] || path
}

export function getFileNameWithoutExtension(path: string): string {
  const name = getFileName(path)
  const lastDot = name.lastIndexOf('.')
  return lastDot === -1 ? name : name.slice(0, lastDot)
}

export function isPdfFile(path: string): boolean {
  return getFileExtension(path) === 'pdf'
}

export function isImageFile(path: string): boolean {
  const ext = getFileExtension(path)
  return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'].includes(ext)
}

export function isWordFile(path: string): boolean {
  const ext = getFileExtension(path)
  return ['doc', 'docx'].includes(ext)
}

export function isExcelFile(path: string): boolean {
  const ext = getFileExtension(path)
  return ['xls', 'xlsx'].includes(ext)
}

export function generateOutputPath(
  inputPath: string,
  suffix: string,
  newExtension?: string
): string {
  const dir = inputPath.substring(0, inputPath.lastIndexOf(/[/\\]/.exec(inputPath)?.[0] || ''))
  const name = getFileNameWithoutExtension(inputPath)
  const ext = newExtension || getFileExtension(inputPath)
  return `${dir}${dir ? '/' : ''}${name}${suffix}.${ext}`
}

export function generateUniqueFileName(basePath: string): string {
  let counter = 1
  let path = basePath
  
  while (true) {
    try {
      const dir = path.substring(0, path.lastIndexOf(/[/\\]/.exec(path)?.[0] || ''))
      const name = getFileNameWithoutExtension(path)
      const ext = getFileExtension(path)
      path = `${dir}${dir ? '/' : ''}${name}_${counter}.${ext}`
      counter++
    } catch {
      return path
    }
  }
}

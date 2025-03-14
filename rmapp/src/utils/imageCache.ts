// cache.ts
interface CacheEntry {
  objectUrl: string | null // Now an Object URL
  blob: Blob | null // Store Blob for reference
  promise: Promise<string> | null // Promise resolves to Object URL
  layerUrls: string[]
  colorMap: { [key: string]: string }
}

const imageCache = new Map<string, CacheEntry>()

export const getCachedImage = (id: string) => imageCache.get(id)

export const setCachedImage = (
  id: string,
  objectUrl: string | null,
  blob: Blob | null,
  promise: Promise<string> | null,
  layerUrls: string[],
  colorMap: { [key: string]: string }
) => {
  const existing = imageCache.get(id)
  if (existing?.objectUrl) {
    URL.revokeObjectURL(existing.objectUrl) // Clean up old URL
  }
  imageCache.set(id, { objectUrl, blob, promise, layerUrls, colorMap })
}

export const clearCachedImage = (id: string) => {
  const entry = imageCache.get(id)
  if (entry?.objectUrl) {
    URL.revokeObjectURL(entry.objectUrl)
  }
  imageCache.delete(id)
}

export const areInputsEqual = (
  cached: CacheEntry,
  layerUrls: string[],
  colorMap: { [key: string]: string }
) => {
  const cachedUrls = cached.layerUrls
  const cachedMap = cached.colorMap

  if (cachedUrls.length !== layerUrls.length) return false
  if (!cachedUrls.every((url, i) => url === layerUrls[i])) return false

  const cachedKeys = Object.keys(cachedMap)
  const newKeys = Object.keys(colorMap)
  if (cachedKeys.length !== newKeys.length) return false
  return cachedKeys.every((key) => cachedMap[key] === colorMap[key])
}

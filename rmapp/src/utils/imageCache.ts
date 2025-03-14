interface CacheEntry {
  dataUrl: string | null
  promise: Promise<string> | null
  layerUrls: string[]
  colorMap: { [key: string]: string }
}

const imageCache = new Map<string, CacheEntry>()

export const getCachedImage = (id: string) => imageCache.get(id)

export const setCachedImage = (
  id: string,
  dataUrl: string | null,
  promise: Promise<string> | null,
  layerUrls: string[],
  colorMap: { [key: string]: string }
) => {
  imageCache.set(id, { dataUrl, promise, layerUrls, colorMap })
}

export const clearCachedImage = (id: string) => {
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

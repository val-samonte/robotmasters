// useProcessedImage.ts
import { getCachedImage, setCachedImage, areInputsEqual } from './imageCache'
import { processImage } from './imageProcessor'

interface ColorMap {
  [key: string]: string
}

const createImageResource = (
  id: string,
  layerUrls: string[],
  colorMap: ColorMap
) => {
  const cached = getCachedImage(id)

  if (cached?.objectUrl && areInputsEqual(cached, layerUrls, colorMap)) {
    return { read: () => cached.objectUrl }
  }

  if (cached?.promise && areInputsEqual(cached, layerUrls, colorMap)) {
    return {
      read: () => {
        throw cached.promise
      },
    }
  }

  const promise = processImage(layerUrls, colorMap).then((blob) => {
    const objectUrl = URL.createObjectURL(blob)
    setCachedImage(id, objectUrl, blob, null, layerUrls, colorMap)
    return objectUrl
  })

  setCachedImage(id, null, null, promise, layerUrls, colorMap)
  return {
    read: () => {
      throw promise
    },
  }
}

export const useProcessedImage = (
  id: string,
  layerUrls: string[],
  colorMap: ColorMap
) => {
  const resource = createImageResource(id, layerUrls, colorMap)
  return resource.read()
}

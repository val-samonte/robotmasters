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

  if (cached?.dataUrl && areInputsEqual(cached, layerUrls, colorMap)) {
    return { read: () => cached.dataUrl }
  }

  if (cached?.promise && areInputsEqual(cached, layerUrls, colorMap)) {
    return {
      read: () => {
        throw cached.promise
      },
    }
  }

  // Inputs differ or no cache: start new processing
  const promise = processImage(layerUrls, colorMap).then((dataUrl) => {
    setCachedImage(id, dataUrl, null, layerUrls, colorMap)
    return dataUrl
  })

  setCachedImage(id, null, promise, layerUrls, colorMap)

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

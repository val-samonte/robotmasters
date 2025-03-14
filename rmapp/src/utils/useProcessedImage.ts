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

  console.log(`createImageResource for ${id}:`, cached)

  if (cached?.objectUrl && areInputsEqual(cached, layerUrls, colorMap)) {
    console.log(`Returning cached objectUrl for ${id}`)
    return { read: () => cached.objectUrl }
  }

  if (cached?.promise && areInputsEqual(cached, layerUrls, colorMap)) {
    console.log(`Suspending with existing promise for ${id}`)
    return {
      read: () => {
        throw cached.promise
      },
    }
  }

  const promise = processImage(layerUrls, colorMap).then((blob) => {
    const objectUrl = URL.createObjectURL(blob)
    setCachedImage(id, objectUrl, blob, null, layerUrls, colorMap)
    console.log(`Promise resolved for ${id}, cached objectUrl`)
    return objectUrl
  })

  setCachedImage(id, null, null, promise, layerUrls, colorMap)
  console.log(`Suspending with new promise for ${id}`)
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
  console.log(`useProcessedImage called with id: ${id}`)
  const resource = createImageResource(id, layerUrls, colorMap)
  return resource.read()
}

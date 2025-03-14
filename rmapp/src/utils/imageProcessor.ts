interface ColorMap {
  [key: string]: string
}

export const processImage = async (
  layerUrls: string[],
  colorMap: ColorMap
): Promise<string> => {
  const images = await Promise.all(
    layerUrls.map((url) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = url
      return new Promise<HTMLImageElement>((resolve) => {
        img.onload = () => {
          resolve(img)
        }
        img.onerror = () => console.error(`Failed to load: ${url}`)
      })
    })
  )

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const firstImage = images[0]
  canvas.width = firstImage.width
  canvas.height = firstImage.height

  images.forEach((img) => {
    ctx.drawImage(img, 0, 0)
  })

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const hex = rgbToHex(r, g, b)

    if (hex in colorMap) {
      const newColor = hexToRgb(colorMap[hex])
      data[i] = newColor.r
      data[i + 1] = newColor.g
      data[i + 2] = newColor.b
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/png')
}

// Helper functions
const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const bigint = parseInt(hex.slice(1), 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

import { ImgHTMLAttributes } from 'react'
import { useProcessedImage } from '../../utils/useProcessedImage'

export interface PaintTileProps
  extends Partial<ImgHTMLAttributes<HTMLImageElement>> {
  src: string
  primary?: string
  secondary?: string
}

export function PaintItem({
  src,
  primary = '#FF00FF',
  secondary = '#00FFFF',
  ...rest
}: PaintTileProps) {
  const layerUrls = [src]
  const colorMap = { '#FF00FF': primary, '#00FFFF': secondary }
  const processedImage = useProcessedImage(
    `${src}_${primary}_${secondary}`,
    layerUrls,
    colorMap
  )

  if (!processedImage) return null

  return <img src={processedImage} draggable={false} {...rest} />
}

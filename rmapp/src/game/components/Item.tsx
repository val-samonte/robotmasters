import cn from 'classnames'
import { useProcessedImage } from '../../utils/useProcessedImage'
import { Slice9 } from './Slice9'
import { SpriteText } from './SpriteText'

export interface ItemProps {
  name: string
  src: string
  className?: string
}

export function Item({ name, src, className }: ItemProps) {
  const layerUrls = ['/button.png']
  const colorMap = { '#0070E8': '#707070', '#38B8F8': '#B8B8B8' }
  const processedImage = useProcessedImage('button_item', layerUrls, colorMap)

  if (!processedImage) return null

  return (
    <Slice9 frameUrl={processedImage}>
      <div className="flex items-center gap-[0.5rem] justify-between">
        <SpriteText>{name}</SpriteText>
        <div className="h-[1rem] flex items-center justify-center relative overflow-visible">
          <img
            src={src}
            alt={name}
            className={cn(className, '-translate-y-[0.125rem]')}
            draggable={false}
          />
        </div>
      </div>
    </Slice9>
  )
}

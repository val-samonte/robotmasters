import cn from 'classnames'
import { useProcessedImage } from '../../utils/useProcessedImage'
import { Slice9 } from './Slice9'
import { SpriteText } from './SpriteText'
import { PaintItem } from './PaintItem'
import { useAtomValue } from 'jotai'
import { paintAtom } from '../../atoms/paintAtom'
import { paints } from '../itemList'

export interface ItemProps {
  name: string
  src: string
  className?: string
  hightlight?: boolean
  primary?: string
  secondary?: string
}

export function Item({
  name,
  src,
  className,
  hightlight,
  primary,
  secondary,
}: ItemProps) {
  const paintId = useAtomValue(paintAtom)
  const paint = paints.find((p) => p.id === paintId)
  const layerUrls = ['/button.png']
  const colorMap = hightlight
    ? { '#0070E8': '#B8B8B8', '#38B8F8': '#FFFFFF' }
    : { '#0070E8': '#707070', '#38B8F8': '#B8B8B8' }

  const processedImage = useProcessedImage(
    `button_item_${hightlight}`,
    layerUrls,
    colorMap
  )

  if (!processedImage) return null

  return (
    <Slice9 frameUrl={processedImage}>
      <div className="flex items-center gap-[0.5rem] justify-between">
        <SpriteText>{name}</SpriteText>
        <div className="w-[4rem] h-[1rem] flex items-center justify-center relative overflow-visible">
          <PaintItem
            src={src}
            alt={name}
            className={cn(className, '-translate-y-[0.125rem]')}
            primary={primary ?? paint?.primary}
            secondary={secondary ?? paint?.secondary}
          />
        </div>
      </div>
    </Slice9>
  )
}

import { ButtonHTMLAttributes } from 'react'
import { Slice9 } from './Slice9'
import { useProcessedImage } from '../../utils/useProcessedImage'
import { SpriteText } from './SpriteText'
import cn from 'classnames'

export interface ButtonProps
  extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
  theme?: string
  color?: string
  className?: string
}

export function Button({
  theme = 'default',
  color,
  children,
  ...props
}: ButtonProps) {
  const layerUrls = ['/button.png']

  const colorMap = {
    default: { '#0070E8': '#707070', '#38B8F8': '#B8B8B8' },
  }[theme] ?? { '#0070E8': '#707070', '#38B8F8': '#B8B8B8' }

  const processedImage = useProcessedImage(
    `button_item_${theme}`,
    layerUrls,
    colorMap
  )

  if (!processedImage) return null

  return (
    <button {...props} className={cn(props.className, 'cursor-pointer')}>
      <Slice9 frameUrl={processedImage}>
        <div className="flex justify-center px-[0.125rem]">
          <SpriteText color={color}>{children}</SpriteText>
        </div>
      </Slice9>
    </button>
  )
}

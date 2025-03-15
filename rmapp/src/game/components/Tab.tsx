import { ReactNode } from 'react'
import { Slice9 } from './Slice9'
import { SpriteText } from './SpriteText'
import { useProcessedImage } from '../../utils/useProcessedImage'
import cn from 'classnames'

export interface TabProps {
  onClick?: () => void
  active?: boolean
  children?: ReactNode
}

export function Tab({ active, children, onClick }: TabProps) {
  const layerUrls = ['/tab.png']
  const colorMap = { '#39BEFF': active ? '#39BEFF' : '#0071EF' }
  const processedImage = useProcessedImage('tab_' + active, layerUrls, colorMap)

  return (
    <Slice9 frameUrl={processedImage ?? '/tab.png'}>
      <button
        onClick={onClick}
        className={cn(
          active ? 'pt-0' : 'pt-[0.125rem]',
          'px-[0.25rem] flex items-center justify-center h-full cursor-pointer'
        )}
      >
        <SpriteText color={active ? '#FFFFFF' : '#B8B8B8'}>
          {children}
        </SpriteText>
      </button>
    </Slice9>
  )
}

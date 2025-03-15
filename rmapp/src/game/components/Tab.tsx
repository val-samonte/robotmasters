import { ReactNode } from 'react'
import { Slice9 } from './Slice9'
import { SpriteText } from './SpriteText'
import { useProcessedImage } from '../../utils/useProcessedImage'
import cn from 'classnames'
import { Icon } from './Icon'

export interface TabProps {
  onClick?: () => void
  active?: boolean
  children?: ReactNode
  asIcon?: boolean
}

export function Tab({ active, children, asIcon, onClick }: TabProps) {
  const layerUrls = ['/tab.png']
  const colorMap = { '#39BEFF': active ? '#39BEFF' : '#0071EF' }
  const processedImage = useProcessedImage('tab_' + active, layerUrls, colorMap)

  return (
    <Slice9
      frameUrl={processedImage ?? '/tab.png'}
      className={cn('relative', !active && 'translate-y-[0.25rem]')}
    >
      <button
        onClick={onClick}
        className={cn(
          asIcon ? 'pr-[0.25rem]' : 'px-[0.25rem]',
          'flex items-center justify-center h-full cursor-pointer'
        )}
      >
        {asIcon ? (
          <Icon color={active ? '#FFFFFF' : '#B8B8B8'}>{children}</Icon>
        ) : (
          <SpriteText color={active ? '#FFFFFF' : '#B8B8B8'}>
            {children}
          </SpriteText>
        )}
      </button>
    </Slice9>
  )
}

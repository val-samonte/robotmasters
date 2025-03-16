import { ReactNode } from 'react'
import { Slice9 } from './Slice9'
import cn from 'classnames'

export interface ItemPreviewProps {
  children: ReactNode
  selected?: boolean
  className?: string
  onClick: () => void
}

export function Selectable({
  children,
  selected,
  className,
  onClick,
}: ItemPreviewProps) {
  return (
    <button onClick={onClick} className={cn('cursor-pointer', className)}>
      <Slice9 frameUrl={selected ? '/select.png' : '/transparent.png'}>
        {children}
      </Slice9>
    </button>
  )
}

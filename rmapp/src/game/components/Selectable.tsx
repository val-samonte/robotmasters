import { ReactNode } from 'react'
import { Slice9 } from './Slice9'

export interface ItemPreviewProps {
  children: ReactNode
  selected?: boolean
  onClick: () => void
}

export function Selectable({ children, selected, onClick }: ItemPreviewProps) {
  return (
    <button onClick={onClick} className="cursor-pointer">
      <Slice9 frameUrl={selected ? '/select.png' : '/transparent.png'}>
        {children}
      </Slice9>
    </button>
  )
}

import { useSetAtom } from 'jotai'
import { ReactNode } from 'react'
import { helpTipAtom } from '../../atoms/helpTipAtom'
import cn from 'classnames'

export interface HelpTipProps {
  title?: string
  message: string
  disable?: boolean
  children: ReactNode
  className?: string
}

export function HelpTip({
  title,
  message,
  children,
  className,
  disable,
}: HelpTipProps) {
  const setTip = useSetAtom(helpTipAtom)

  return (
    <div
      className={cn('flex justify-between items-center', className)}
      onMouseEnter={() => {
        if (!disable) setTip({ title, message })
      }}
      onMouseLeave={() => {
        if (!disable) setTip(null)
      }}
    >
      {children}
    </div>
  )
}

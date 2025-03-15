import { ReactNode } from 'react'
import { SpriteText } from './SpriteText'

export interface PanelProps {
  children: ReactNode
  title?: string
}

export function Panel({ children, title }: PanelProps) {
  return (
    <div className="h-full flex flex-col">
      {title && (
        <SpriteText color="#38B8F8" className="p-[0.5rem]">
          {title.toUpperCase()}
        </SpriteText>
      )}
      <div className="flex-auto relative">
        <div className="inset-0 absolute flex flex-col py-[0.5rem] gap-[1rem] overflow-auto custom-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}

import { ReactNode } from 'react'
import { Icon } from './Icon'
import { SpriteText } from './SpriteText'

export interface ElemLabelProps {
  value: string
  children?: ReactNode
}

const labels: any = {
  B: 'BLAST',
  C: 'CRYO',
  F: 'FORCE',
  H: 'HEAT',
  J: 'JOLT',
  P: 'PUNCT',
  S: 'SEVER',
  V: 'VIRUS',
}

export function ElemLabel({ value, children }: ElemLabelProps) {
  const sym = value.charAt(0).toUpperCase()
  return (
    <div className="flex gap-[0.25rem]">
      <Icon>{sym}</Icon>
      <SpriteText>{children ?? labels[sym]}</SpriteText>
    </div>
  )
}

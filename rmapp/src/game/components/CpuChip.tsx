import { cpuDesc } from '../itemList'
import { HelpTip } from './HelpTip'
import { Slice9 } from './Slice9'
import { SpriteText } from './SpriteText'

export interface CpuItemProps {
  index: number
  name: string
  customTip?: string
}

export function CpuChip({ index, name, customTip }: CpuItemProps) {
  return (
    <HelpTip
      message={customTip ?? cpuDesc[name]}
      title={name.toUpperCase()}
      className="h-[2rem]"
    >
      <Slice9 frameUrl="/cpu_frame.png">
        <div className="pr-[0.5rem] flex gap-[0.5rem]">
          <SpriteText color="#F8E0A0">{index + 1}</SpriteText>
          <SpriteText>{name.toUpperCase()}</SpriteText>
        </div>
      </Slice9>
    </HelpTip>
  )
}

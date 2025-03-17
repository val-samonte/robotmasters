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
      className="gap-[1rem] h-[2rem] w-full"
    >
      <div className="flex gap-[0.25rem]">
        <SpriteText>{index + 1}</SpriteText>
      </div>
      <Slice9 frameUrl="/cpu_frame.png">
        <div className="pr-[0.5rem] flex gap-[0.5rem]">
          <SpriteText>{name.toUpperCase()}</SpriteText>
        </div>
      </Slice9>
    </HelpTip>
  )
}

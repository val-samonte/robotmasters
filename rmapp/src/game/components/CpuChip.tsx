import { cpuDesc } from '../itemList'
import { HelpTip } from './HelpTip'
import { Slice9 } from './Slice9'
import { SpriteText } from './SpriteText'

export interface CpuItemProps {
  index: number
  name: string
}

export function CpuChip({ index, name }: CpuItemProps) {
  return (
    <HelpTip message={cpuDesc[name]} title={name.toUpperCase()}>
      <Slice9 frameUrl="/cpu_frame.png">
        <div className="pr-[0.25rem] flex gap-[0.5rem]">
          <SpriteText color="#F8E0A0">{index + 1}</SpriteText>
          <SpriteText>{name.toUpperCase()}</SpriteText>
        </div>
      </Slice9>
    </HelpTip>
  )
}

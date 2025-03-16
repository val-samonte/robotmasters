import { HelpTip } from './HelpTip'
import { Icon } from './Icon'
import { Slice9 } from './Slice9'
import { SpriteText } from './SpriteText'

export interface ActionChipProps {
  name: string
  cost: number
}

export function ActionChip({ name, cost }: ActionChipProps) {
  return (
    <HelpTip title={name.toUpperCase()} message={''} disable={true}>
      <Slice9 frameUrl="/action_frame.png">
        <div className="pl-[0.25rem] flex gap-[0.5rem]">
          <SpriteText>{name.toUpperCase()}</SpriteText>
        </div>
      </Slice9>
      <div className="flex gap-[0.25rem]">
        <Icon>E</Icon>
        <SpriteText>{cost}</SpriteText>
      </div>
    </HelpTip>
  )
}

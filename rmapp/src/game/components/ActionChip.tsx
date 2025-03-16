import cn from 'classnames'
import { HelpTip } from './HelpTip'
import { Icon } from './Icon'
import { Slice9 } from './Slice9'
import { SpriteText } from './SpriteText'

export interface ActionChipProps {
  name: string
  cost: number
  inserted?: boolean
  className?: string
}

export function ActionChip({
  name,
  cost,
  className,
  inserted,
}: ActionChipProps) {
  return (
    <HelpTip
      title={name.toUpperCase()}
      message={''}
      disable={true}
      className={cn('gap-[1rem] h-[2rem]', className)}
    >
      <Slice9
        frameUrl="/action_frame.png"
        className={cn(inserted && 'animate-[snap_200ms_steps(1)]')}
      >
        <div className="pl-[0.25rem] flex gap-[0.5rem]">
          <SpriteText className="relative">{name.toUpperCase()}</SpriteText>
        </div>
      </Slice9>
      <div className="flex gap-[0.25rem]">
        <Icon>E</Icon>
        <SpriteText>{cost}</SpriteText>
      </div>
    </HelpTip>
  )
}

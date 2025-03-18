import { useAtomValue } from 'jotai'
import { helpTipAtom } from '../../atoms/helpTipAtom'
import { Slice9 } from './Slice9'
import { ReactNode } from 'react'
import { SpriteText } from './SpriteText'

export function HelpPanel({ children }: { children: ReactNode }) {
  const helpTip = useAtomValue(helpTipAtom)

  return (
    <Slice9>
      <div className="p-[0.5rem] flex flex-col gap-[0.5rem] landscape:h-[3.5rem] overflow-auto">
        {helpTip ? (
          <>
            {helpTip.title && (
              <SpriteText color="#38B8F8">{helpTip.title}</SpriteText>
            )}
            <SpriteText>{helpTip.message}</SpriteText>
          </>
        ) : (
          <SpriteText>{children}</SpriteText>
        )}
      </div>
    </Slice9>
  )
}

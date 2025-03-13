import { useAtomValue } from 'jotai'
import { viewModeAtom } from '../../atoms/viewModeAtom'
import cn from 'classnames'
import { useMeasure } from '@uidotdev/usehooks'
import { useMemo } from 'react'
import { CharacterPreview } from '../components/CharacterPreview'

export function CharacterCreationScreen() {
  const viewMode = useAtomValue(viewModeAtom)
  const [containerRef, container] = useMeasure()

  const sizes = useMemo(() => {
    if (!container.width) return null
    // assume view mode is 3 always for now
    const sides = Math.floor((container.width * 0.3) / 8) * 8
    const main = Math.floor((container.width * 0.4) / 8) * 8

    return { sides, main }
  }, [container, viewMode])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-900 items-center justify-center"
    >
      <CharacterPreview head="2" body="2" legs="2" weapon="hg_2" />
      {/* <div
        className={cn(
          'flex justify-between h-full',
          viewMode === 1 && 'flex-col'
        )}
      >
        <div
          style={{ width: sizes ? sizes.sides + 'px' : undefined }}
          className={cn('h-full bg-green-400')}
        ></div>
        <div
          style={{ width: sizes ? sizes.main + 'px' : undefined }}
          className={cn('h-full bg-blue-400')}
        ></div>
        <div
          style={{ width: sizes ? sizes.sides + 'px' : undefined }}
          className={cn('h-full bg-green-400')}
        ></div>
      </div> */}
    </div>
  )
}

import { usePlayerSkin } from '../../utils/usePlayerSkin'
export interface CharacterPreviewProps {
  body: string
  head: string
  legs: string
  weapon: string
}

export function CharacterPreview(props: CharacterPreviewProps) {
  const skin = usePlayerSkin(props)

  if (!skin) return null

  return (
    <div className="relative w-[4rem] h-[4rem] overflow-hidden">
      <img
        className="absolute w-[12rem] h-[12rem] max-w-none select-auto pointer-events-auto"
        src={skin ?? undefined}
        draggable="false"
      />
    </div>
  )
}

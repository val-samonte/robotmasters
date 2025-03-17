import { useAtomValue } from 'jotai'
import { useProcessedImage } from '../../utils/useProcessedImage'
import { paintAtom } from '../../atoms/paintAtom'
import { paints } from '../itemList'

export interface CharacterPreviewProps {
  body: string
  head: string
  legs: string
  weapon: string
}

export function CharacterPreview({
  body,
  head,
  legs,
  weapon,
}: CharacterPreviewProps) {
  const weapon_type = weapon.split('_')[0]
  const arm = [weapon_type, body].join('_')
  const paintId = useAtomValue(paintAtom)
  const paint = paints.find((p) => p.id === paintId)

  const layerUrls = [
    `/skins/body_${body}.png`,
    `/skins/legs_${legs}.png`,
    `/skins/head_${head}.png`,
    `/skins/${weapon}.png`,
    `/skins/arms_${arm}.png`,
  ]
  const colorMap = {
    '#FF00FF': paint?.primary ?? '#5B6EE1',
    '#00FFFF': paint?.secondary ?? '#FFFFFF',
  }
  const processedImage = useProcessedImage('player1', layerUrls, colorMap)

  if (!processedImage) return null

  return (
    <div className="relative w-[4rem] h-[4rem] overflow-hidden">
      <img
        className="absolute w-[12rem] h-[12rem] max-w-none select-auto pointer-events-auto"
        src={processedImage ?? undefined}
        draggable="false"
      />
    </div>
  )
}

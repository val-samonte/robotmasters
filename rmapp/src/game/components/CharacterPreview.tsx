import { useProcessedImage } from '../../utils/useProcessedImage'

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

  const layerUrls = [
    `/skins/body_${body}.png`,
    `/skins/legs_${legs}.png`,
    `/skins/head_${head}.png`,
    `/skins/${weapon}.png`,
    `/skins/arms_${arm}.png`,
  ]
  const colorMap = { '#5B6EE1': '#00FF99' }
  const processedImage = useProcessedImage('player1', layerUrls, colorMap)

  return (
    <div className="relative w-[4rem] h-[4rem] overflow-hidden">
      <img
        className="absolute w-[12rem] h-[12rem] max-w-none"
        src={processedImage ?? undefined}
        alt="Processed Spritesheet"
        draggable="false"
      />
    </div>
  )
}

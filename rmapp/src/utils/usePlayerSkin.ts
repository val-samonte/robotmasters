import { useAtomValue } from 'jotai'
import { paintAtom } from '../atoms/paintAtom'
import { paints } from '../game/itemList'
import { useProcessedImage } from './useProcessedImage'

export const usePlayerSkin = ({
  head,
  body,
  legs,
  weapon,
}: {
  head: string
  body: string
  legs: string
  weapon: string
}) => {
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

  return processedImage
}

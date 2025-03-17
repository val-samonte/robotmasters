import { Graphics } from 'pixi.js'
import { useCallback } from 'react'
import { CharacterEntity } from '../types/Entity'

export function CharacterRender({ x, y, width, height }: CharacterEntity) {
  const drawCallback = useCallback(
    (graphics: Graphics) => {
      graphics.clear()
      graphics.setFillStyle({ color: 'green' })
      graphics.rect(0, 0, width, height)
      graphics.fill()
    },
    [width, height]
  )

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics draw={drawCallback} />
    </pixiContainer>
  )
}

import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

export function GameObjectView({
  x,
  y,
  width,
  height,
  color = 'yellow',
}: {
  x: number
  y: number
  width: number
  height: number
  color?: string
}) {
  const drawCallback = useCallback(
    (graphics: Graphics) => {
      graphics.clear()
      graphics.setFillStyle({ color })
      graphics.rect(0, 0, width, height)
      graphics.fill()
    },
    [width, height, color]
  )

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics draw={drawCallback} />
    </pixiContainer>
  )
}

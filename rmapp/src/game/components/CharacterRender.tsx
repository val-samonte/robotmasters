import { Assets, Texture, Rectangle } from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'
import { CharacterEntity } from '../types/Entity'
import { usePlayerSkin } from '../../utils/usePlayerSkin'
import { useBlobUrlToBase64 } from '../../utils/useBlobToBase64'
import { actionLookup } from '../constants'

export function CharacterRender({
  x,
  y,
  c_bottom,
  vel_x,
  vel_y,
  dir_x,
  health,
  head,
  body,
  legs,
  weapon,
  last_action,
  // last_action_frame,
  frame,
}: CharacterEntity & {
  head: string
  body: string
  legs: string
  weapon: string
  frame: number
}) {
  const blob = usePlayerSkin({ head, body, legs, weapon })
  const skin = useBlobUrlToBase64(blob)
  const [texture, setTexture] = useState<Texture | null>(null)

  useEffect(() => {
    if (!skin) {
      setTexture(null)
      return
    }

    let isMounted = true

    Assets.load(skin)
      .then((loadedTexture) => {
        if (isMounted) {
          setTexture(loadedTexture)
        }
      })
      .catch((error) => {
        console.error('Failed to load texture:', error)
      })

    return () => {
      isMounted = false
    }
  }, [skin])

  const displayTexture = useMemo(() => {
    if (!texture) return null

    const boxWidth = 32
    const boxHeight = 32

    let boxX = 0
    let boxY = 0

    if (health === 0) {
      boxX = 2
      boxY = 2
    } else if (last_action === actionLookup.findIndex((i) => i === 'hurt')) {
      boxX = 2
      boxY = 0
    } else if (c_bottom) {
      if (vel_x === 0) {
        boxY = 0
        if (last_action === actionLookup.findIndex((i) => i === 'charge')) {
          boxX = 1
        } else {
          boxX = 0
        }
      } else {
        // running
        const index = Math.floor((frame % 16) / 4)
        boxY = 1
        boxX = [0, 1, 2, 1][index]
      }
    } else {
      boxY = 2
      boxX = vel_y < 0 ? 1 : 0
    }

    const box = new Rectangle(
      boxX * boxWidth, // e.g., 0
      boxY * boxHeight, // e.g., 0
      boxWidth, // 32
      boxHeight // 32
    )

    return new Texture({
      source: texture.source,
      frame: box,
    })
  }, [texture, frame, health, last_action, c_bottom, vel_x, vel_y])

  return (
    <pixiContainer x={x} y={y} scale={{ x: dir_x ? 1 : -1, y: 1 }}>
      {displayTexture && (
        <pixiSprite
          x={dir_x ? -8 : -23}
          y={-3}
          anchor={{ x: 0, y: 0 }}
          texture={displayTexture}
        />
      )}
    </pixiContainer>
  )
}

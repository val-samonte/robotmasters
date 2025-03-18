import { Assets, Texture } from 'pixi.js'
import { useEffect, useState } from 'react'

export function MapRender({ skin }: { skin: string }) {
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

  if (!texture) return null

  return <pixiSprite x={0} y={0} texture={texture} />
}

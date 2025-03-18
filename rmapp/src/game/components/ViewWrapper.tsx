import { useMeasure } from '@uidotdev/usehooks'
import { ReactNode, useMemo } from 'react'

export function ViewWrapper({ children }: { children: ReactNode }) {
  const [ref, { width }] = useMeasure()

  // how many 256 will fit inside width?
  // scale it based on that

  const scale =
    useMemo(() => {
      if (width === null) return null
      return Math.floor(width / 256)
    }, [width]) ?? 1

  const offsetX = -(256 * scale) / 2
  const offsetY = -(240 * scale) / 2

  return (
    <div
      className="w-full h-full items-center justify-center relative"
      ref={ref}
    >
      <div
        style={{
          imageRendering: 'pixelated',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: `${offsetY}px`,
          marginLeft: `${offsetX}px`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

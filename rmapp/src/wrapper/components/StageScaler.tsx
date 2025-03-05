import { ReactNode, useEffect, useRef, useState } from 'react'

export function StageScaler({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth: containerWidth, clientHeight: containerHeight } =
          containerRef.current
        setScale(Math.min(containerWidth / 256, containerHeight / 240))
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const offsetX = -(256 * scale) / 2
  const offsetY = -(240 * scale) / 2

  return (
    <div ref={containerRef} className="relative w-full h-full">
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

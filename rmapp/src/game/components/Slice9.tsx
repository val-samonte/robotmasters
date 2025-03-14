import cn from 'classnames'
import React, { useRef, useEffect } from 'react'
import { useAtomValue } from 'jotai'

// Assuming rootFontSizeAtom is defined elsewhere
import { rootFontSizeAtom } from '../../atoms/rootFontSizeAtom'

interface Slice9Props {
  children: React.ReactNode
  className?: string
  frameUrl?: string
}

export function Slice9({
  children,
  className,
  frameUrl = '/frame.png',
}: Slice9Props) {
  const rootFontSize = useAtomValue(rootFontSizeAtom) // e.g., 8 or 16
  const canvasRefs = {
    topLeft: useRef<HTMLCanvasElement>(null),
    top: useRef<HTMLCanvasElement>(null),
    topRight: useRef<HTMLCanvasElement>(null),
    left: useRef<HTMLCanvasElement>(null),
    right: useRef<HTMLCanvasElement>(null),
    bottomLeft: useRef<HTMLCanvasElement>(null),
    bottom: useRef<HTMLCanvasElement>(null),
    bottomRight: useRef<HTMLCanvasElement>(null),
  }

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // Still include CORS
    img.src = frameUrl

    const drawCanvas = (
      ref: React.RefObject<HTMLCanvasElement>,
      x: number,
      y: number,
      tileSize: number
    ) => {
      const canvas = ref.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = tileSize
          canvas.height = tileSize
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(
            img,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize,
            0,
            0,
            tileSize,
            tileSize
          )
          console.log(`Drew ${x},${y} on ${canvas.className}`)
        } else {
          console.error(`No context for ${canvas.className}`)
        }
      }
    }

    const drawAll = (tileSize: number) => {
      console.log(
        `Drawing for ${frameUrl} with tileSize ${tileSize}, wrapperFontSize ${
          (rootFontSize / 8) * tileSize
        }px`
      )
      drawCanvas(canvasRefs.topLeft, 0, 0, tileSize)
      drawCanvas(canvasRefs.top, 1, 0, tileSize)
      drawCanvas(canvasRefs.topRight, 2, 0, tileSize)
      drawCanvas(canvasRefs.left, 0, 1, tileSize)
      drawCanvas(canvasRefs.right, 2, 1, tileSize)
      drawCanvas(canvasRefs.bottomLeft, 0, 2, tileSize)
      drawCanvas(canvasRefs.bottom, 1, 2, tileSize)
      drawCanvas(canvasRefs.bottomRight, 2, 2, tileSize)
    }

    img.onload = () => {
      const tileSize = Math.floor(Math.min(img.width, img.height) / 3)
      const adjustedTileSize = tileSize % 2 === 0 ? tileSize : tileSize + 1
      console.log(`Loaded ${frameUrl}, tileSize: ${adjustedTileSize}`)
      setTimeout(() => drawAll(adjustedTileSize), 0) // Ensure DOM readiness
    }
    img.onerror = () => console.error(`Failed to load image: ${frameUrl}`)
  }, [frameUrl, rootFontSize]) // Redraw if frameUrl or rootFontSize changes

  const adjustedTileSize = null // Not cached, computed on load
  const wrapperFontSize = adjustedTileSize
    ? (rootFontSize / 8) * adjustedTileSize
    : rootFontSize

  return (
    <div
      className={cn('flex flex-col', className)}
      style={{ fontSize: `${wrapperFontSize}px` }}
    >
      <div className="flex">
        <canvas
          ref={canvasRefs.topLeft}
          className="w-[1em] h-[1em] flex-shrink-0"
          style={{ border: '1px solid red' }}
        />
        <canvas
          ref={canvasRefs.top}
          className="flex-1 h-[1em]"
          style={{ border: '1px solid red' }}
        />
        <canvas
          ref={canvasRefs.topRight}
          className="w-[1em] h-[1em] flex-shrink-0"
          style={{ border: '1px solid red' }}
        />
      </div>
      <div className="flex flex-1">
        <canvas
          ref={canvasRefs.left}
          className="w-[1em] flex-shrink-0"
          style={{ minHeight: '1em', border: '1px solid red' }}
        />
        <div
          className="flex-1"
          style={{ minWidth: 0, minHeight: 0, fontSize: '1rem' }}
        >
          {children}
        </div>
        <canvas
          ref={canvasRefs.right}
          className="w-[1em] flex-shrink-0"
          style={{ minHeight: '1em', border: '1px solid red' }}
        />
      </div>
      <div className="flex">
        <canvas
          ref={canvasRefs.bottomLeft}
          className="w-[1em] h-[1em] flex-shrink-0"
          style={{ border: '1px solid red' }}
        />
        <canvas
          ref={canvasRefs.bottom}
          className="flex-1 h-[1em]"
          style={{ border: '1px solid red' }}
        />
        <canvas
          ref={canvasRefs.bottomRight}
          className="w-[1em] h-[1em] flex-shrink-0"
          style={{ border: '1px solid red' }}
        />
      </div>
    </div>
  )
}

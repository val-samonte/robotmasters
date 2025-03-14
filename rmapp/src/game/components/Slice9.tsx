import cn from 'classnames'
import React, { useRef, useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

// Assuming rootFontSizeAtom is defined elsewhere
import { rootFontSizeAtom } from '../../atoms/rootFontSizeAtom' // Adjust the import path

interface Slice9Props {
  children: React.ReactNode
  className?: string
  frameUrl?: string
}

// Embedded image cache
const imageCache: {
  [url: string]: {
    img: HTMLImageElement
    loaded: boolean
    listeners: (() => void)[]
  }
} = {}

export function Slice9({
  children,
  className,
  frameUrl = '/frame.png',
}: Slice9Props) {
  const [tileSize, setTileSize] = useState<number | null>(null) // Detect tileSize dynamically
  const rootFontSize = useAtomValue(rootFontSizeAtom) // e.g., 16
  const adjustedTileSize =
    tileSize && tileSize % 2 === 0 ? tileSize : tileSize ? tileSize + 1 : null
  const wrapperFontSize = adjustedTileSize
    ? (rootFontSize / 8) * adjustedTileSize
    : rootFontSize // Fallback to rootFontSize

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
    let entry = imageCache[frameUrl]
    if (!entry) {
      const img = new Image()
      img.src = frameUrl
      entry = {
        img,
        loaded: img.complete,
        listeners: [],
      }
      imageCache[frameUrl] = entry

      img.onload = () => {
        entry.loaded = true
        const detectedTileSize = Math.min(img.width, img.height) / 3 // Assume 3x3 grid
        setTileSize(Math.floor(detectedTileSize)) // Floor to nearest integer
        entry.listeners.forEach((callback) => callback())
        entry.listeners = []
      }
      img.onerror = () => console.error(`Failed to load image: ${frameUrl}`)
    }
    const img = entry.img

    const drawCanvas = (
      ref: React.RefObject<HTMLCanvasElement>,
      x: number,
      y: number
    ) => {
      const canvas = ref.current
      if (canvas && adjustedTileSize) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = adjustedTileSize
          canvas.height = adjustedTileSize
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(
            img,
            x * adjustedTileSize,
            y * adjustedTileSize,
            adjustedTileSize,
            adjustedTileSize,
            0,
            0,
            adjustedTileSize,
            adjustedTileSize
          )
        }
      }
    }

    const drawAll = () => {
      if (!adjustedTileSize) return // Wait for tileSize
      console.log(
        `Drawing for ${frameUrl} with tileSize ${adjustedTileSize}, wrapperFontSize ${wrapperFontSize}px`
      )
      drawCanvas(canvasRefs.topLeft, 0, 0)
      drawCanvas(canvasRefs.top, 1, 0)
      drawCanvas(canvasRefs.topRight, 2, 0)
      drawCanvas(canvasRefs.left, 0, 1)
      drawCanvas(canvasRefs.right, 2, 1)
      drawCanvas(canvasRefs.bottomLeft, 0, 2)
      drawCanvas(canvasRefs.bottom, 1, 2)
      drawCanvas(canvasRefs.bottomRight, 2, 2)
    }

    if (entry.loaded && img.width && img.height) {
      const detectedTileSize = Math.min(img.width, img.height) / 3
      setTileSize(Math.floor(detectedTileSize))
      drawAll()
    } else {
      entry.listeners.push(drawAll)
      return () => {
        entry.listeners = entry.listeners.filter((cb) => cb !== drawAll)
      }
    }
  }, [frameUrl, adjustedTileSize, wrapperFontSize])

  return (
    <div
      className={cn('flex flex-col', className)}
      style={{ fontSize: `${wrapperFontSize}px` }} // Set em base for tiles
    >
      <div className="flex">
        <canvas
          ref={canvasRefs.topLeft}
          className="w-[1em] h-[1em] flex-shrink-0"
        />
        <canvas ref={canvasRefs.top} className="flex-1 h-[1em]" />
        <canvas
          ref={canvasRefs.topRight}
          className="w-[1em] h-[1em] flex-shrink-0"
        />
      </div>
      <div className="flex flex-1">
        <canvas
          ref={canvasRefs.left}
          className="w-[1em] flex-shrink-0"
          style={{ minHeight: '1em' }}
        />
        <div
          className="flex-1"
          style={{ minWidth: 0, minHeight: 0, fontSize: '1rem' }} // Reset to root font-size
        >
          {children}
        </div>
        <canvas
          ref={canvasRefs.right}
          className="w-[1em] flex-shrink-0"
          style={{ minHeight: '1em' }}
        />
      </div>
      <div className="flex">
        <canvas
          ref={canvasRefs.bottomLeft}
          className="w-[1em] h-[1em] flex-shrink-0"
        />
        <canvas ref={canvasRefs.bottom} className="flex-1 h-[1em]" />
        <canvas
          ref={canvasRefs.bottomRight}
          className="w-[1em] h-[1em] flex-shrink-0"
        />
      </div>
    </div>
  )
}

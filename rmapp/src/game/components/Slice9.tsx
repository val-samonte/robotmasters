import cn from 'classnames'
import React, { useRef, useEffect } from 'react'

// Shared image cache
const imageCache: { [key: string]: HTMLImageElement } = {}

interface Slice9Props {
  children: React.ReactNode
  className?: string
  spriteSheetUrl?: string
}

export function Slice9({
  children,
  className,
  spriteSheetUrl = '/frame.png',
}: Slice9Props) {
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
    let img = imageCache[spriteSheetUrl]
    if (!img) {
      img = new Image()
      img.src = spriteSheetUrl
      imageCache[spriteSheetUrl] = img
    }

    const drawCanvas = (
      ref: React.RefObject<HTMLCanvasElement>,
      x: number,
      y: number
    ) => {
      const canvas = ref.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = 8
          canvas.height = 8
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(img, x, y, 8, 8, 0, 0, 8, 8)
        }
      }
    }

    const handleLoad = () => {
      drawCanvas(canvasRefs.topLeft, 0, 0)
      drawCanvas(canvasRefs.top, 8, 0)
      drawCanvas(canvasRefs.topRight, 16, 0)
      drawCanvas(canvasRefs.left, 0, 8)
      drawCanvas(canvasRefs.right, 16, 8)
      drawCanvas(canvasRefs.bottomLeft, 0, 16)
      drawCanvas(canvasRefs.bottom, 8, 16)
      drawCanvas(canvasRefs.bottomRight, 16, 16)
    }

    if (img.complete) {
      handleLoad()
    } else {
      img.onload = handleLoad
    }

    return () => {
      img.onload = null // Cleanup
    }
  }, [spriteSheetUrl])

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex">
        <canvas ref={canvasRefs.topLeft} className="w-[8px] h-[8px]" />
        <canvas ref={canvasRefs.top} className="flex-1 h-[8px]" />
        <canvas ref={canvasRefs.topRight} className="w-[8px] h-[8px]" />
      </div>
      <div className="flex">
        <canvas
          ref={canvasRefs.left}
          className="w-[8px]"
          style={{ minHeight: '8px' }}
        />
        <div className="flex-1 bg-black" style={{ minWidth: 0, minHeight: 0 }}>
          {children}
        </div>
        <canvas
          ref={canvasRefs.right}
          className="w-[8px]"
          style={{ minHeight: '8px' }}
        />
      </div>
      <div className="flex">
        <canvas ref={canvasRefs.bottomLeft} className="w-[8px] h-[8px]" />
        <canvas ref={canvasRefs.bottom} className="flex-1 h-[8px]" />
        <canvas ref={canvasRefs.bottomRight} className="w-[8px] h-[8px]" />
      </div>
    </div>
  )
}

import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

// Assuming rootFontSizeAtom is defined elsewhere
import { rootFontSizeAtom } from '../../atoms/rootFontSizeAtom'

interface Slice9Props {
  children: React.ReactNode
  className?: string
  frameUrl?: string
}

// Embedded image cache with Object URLs
const imageCache: {
  [url: string]: {
    objectUrls: string[] // 9 slices as Object URLs
    tileSize: number
    loaded: boolean
    listeners: (() => void)[]
  }
} = {}

export function Slice9({
  children,
  className,
  frameUrl = '/frame.png',
}: Slice9Props) {
  const rootFontSize = useAtomValue(rootFontSizeAtom) // e.g., 16
  const [sliceUrls, setSliceUrls] = useState<string[] | null>(null)

  useEffect(() => {
    let entry = imageCache[frameUrl]
    if (!entry) {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = frameUrl
      entry = {
        objectUrls: [],
        tileSize: 0,
        loaded: img.complete,
        listeners: [],
      }
      imageCache[frameUrl] = entry

      img.onload = () => {
        const tileSize = Math.floor(Math.min(img.width, img.height) / 3)
        entry.tileSize = tileSize % 2 === 0 ? tileSize : tileSize + 1
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = entry.tileSize
        canvas.height = entry.tileSize

        const slices = [
          [0, 0],
          [1, 0],
          [2, 0], // Top row
          [0, 1],
          [1, 1],
          [2, 1], // Middle row (including center)
          [0, 2],
          [1, 2],
          [2, 2], // Bottom row
        ]

        const slicePromises = slices.map(([x, y]) => {
          ctx.clearRect(0, 0, entry.tileSize, entry.tileSize)
          ctx.drawImage(
            img,
            x * entry.tileSize,
            y * entry.tileSize,
            entry.tileSize,
            entry.tileSize,
            0,
            0,
            entry.tileSize,
            entry.tileSize
          )
          return new Promise<string>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(URL.createObjectURL(blob!))
            }, 'image/png')
          })
        })

        Promise.all(slicePromises).then((urls) => {
          entry.objectUrls = urls
          entry.loaded = true
          entry.listeners.forEach((callback) => callback())
          entry.listeners = []
        })
      }
      img.onerror = () => {}
    }

    const updateSlices = () => {
      if (entry.loaded && entry.objectUrls.length === 9) {
        setSliceUrls(entry.objectUrls)
      }
    }

    if (entry.loaded && entry.objectUrls.length === 9) {
      updateSlices()
    } else {
      entry.listeners.push(updateSlices)
      return () => {
        entry.listeners = entry.listeners.filter((cb) => cb !== updateSlices)
      }
    }
  }, [frameUrl])

  const adjustedTileSize = sliceUrls ? imageCache[frameUrl].tileSize : null
  const wrapperFontSize = adjustedTileSize
    ? (rootFontSize / 8) * adjustedTileSize
    : rootFontSize

  if (!sliceUrls) {
    return null
  }

  return (
    <div
      className={cn('flex flex-col pointer-events-none', className)}
      style={{ fontSize: `${wrapperFontSize}px` }}
    >
      <div className="flex">
        <img
          src={sliceUrls[0]}
          className="w-[1em] h-[1em] flex-shrink-0 select-none"
          alt="top-left"
          draggable="false"
        />
        <img
          src={sliceUrls[1]}
          className="flex-1 h-[1em] select-none"
          alt="top"
          draggable="false"
        />
        <img
          src={sliceUrls[2]}
          className="w-[1em] h-[1em] flex-shrink-0 select-none"
          alt="top-right"
          draggable="false"
        />
      </div>
      <div className="flex flex-1">
        <img
          src={sliceUrls[3]}
          className="w-[1em] flex-shrink-0 select-none"
          style={{ minHeight: '1em' }}
          alt="left"
          draggable="false"
        />
        <div
          className="flex-1 pointer-events-auto"
          style={{
            minWidth: 0,
            minHeight: 0,
            fontSize: '1rem',
            backgroundImage: `url(${sliceUrls[4]})`, // Center slice [1, 1]
            backgroundRepeat: 'repeat', // Repeat x and y
          }}
        >
          {children}
        </div>
        <img
          src={sliceUrls[5]}
          className="w-[1em] flex-shrink-0 select-none"
          style={{ minHeight: '1em' }}
          alt="right"
          draggable="false"
        />
      </div>
      <div className="flex">
        <img
          src={sliceUrls[6]}
          className="w-[1em] h-[1em] flex-shrink-0 select-none"
          alt="bottom-left"
          draggable="false"
        />
        <img
          src={sliceUrls[7]}
          className="flex-1 h-[1em] select-none"
          alt="bottom"
          draggable="false"
        />
        <img
          src={sliceUrls[8]}
          className="w-[1em] h-[1em] flex-shrink-0 select-none"
          alt="bottom-right"
          draggable="false"
        />
      </div>
    </div>
  )
}

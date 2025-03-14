import { useEffect, useState } from 'react'
import { viewModeAtom } from '../../atoms/viewModeAtom'
import { useAtom, useSetAtom } from 'jotai'
import { Outlet } from 'react-router'
import { rootFontSizeAtom } from '../../atoms/rootFontSizeAtom'

export function Stage() {
  const setFontSize = useSetAtom(rootFontSizeAtom)
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [mode, setMode] = useAtom(viewModeAtom)
  const [stageDimension, setStageDimension] = useState({
    width: '100%',
    height: '100vh',
  })

  useEffect(() => {
    const onResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    const isPortrait = size.height >= size.width
    const width = Math.floor(size.width / 8) * 8
    const height = Math.floor(size.height / 8) * 8

    const smallestSize = 288
    const base = Math.max(smallestSize, isPortrait ? width : height)
    const amountToScale = base / smallestSize
    const fontSize = 8 * Math.floor(amountToScale)

    document.documentElement.style.fontSize = `${fontSize}px`
    setFontSize(fontSize)

    setStageDimension({ width: width + 'px', height: height + 'px' })

    // check mode:
    // mode 1: if square / portrait
    // mode 2: if greater than square and less than 7/4 aspect ratio
    // mode 3: if greater than 7/4 aspect ratio and less than 2/1 aspect ratio

    setMode(isPortrait ? 1 : width / height < 1.75 ? 2 : 3)
  }, [size, setFontSize])

  if (mode === 0) return null

  return (
    <div
      className="relative margin-x-auto"
      style={{
        width: stageDimension.width,
        height: stageDimension.height,
      }}
    >
      <Outlet />
    </div>
  )
}

// Punct, // P - blue
//     Blast, // B - green
//     Force, // F - orange
//     Sever, // S - silver
//     Heat,  // H - red
//     Cryo,  // C - cyan
//     Jolt,  // J - yellow
//     Virus, // V - magenta

import cn from 'classnames'
import { useEffect, useState } from 'react'
import { viewModeAtom } from '../../atoms/viewModeAtom'
import { useAtom } from 'jotai'
import { SpriteText } from './SpriteText'

export function Stage() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [isPortrait, setIsPortrait] = useState(false)
  const [counterSideSize, setCounterSideSize] = useState(0)
  const [mode, setMode] = useAtom(viewModeAtom)

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
    setIsPortrait(isPortrait)

    const rawBase = isPortrait ? size.width : size.height
    const base = Math.max(320, Math.floor(rawBase / 2) * 2)

    const amountToScale = base / 320
    const fontSize = base <= 320 ? 8 : 8 * amountToScale

    document.documentElement.style.fontSize = `${fontSize}px`

    const rawCounterSide = Math.min(
      base * 2,
      isPortrait ? size.height : size.width
    )
    const counterSide = Math.floor(rawCounterSide / 2) * 2
    setCounterSideSize(counterSide)

    // check mode:
    // mode 1: if square / portrait
    // mode 2: if greater than square and less than 7/4 aspect ratio
    // mode 3: if greater than 7/4 aspect ratio and less than 2/1 aspect ratio

    setMode(isPortrait ? 1 : size.width / size.height < 1.75 ? 2 : 3)
  }, [size])

  if (mode === 0) return null

  return (
    <div
      className={cn(!isPortrait ? 'h-[40rem]' : 'h-screen')}
      style={{ width: isPortrait ? '100%' : `${counterSideSize}px` }}
    >
      <div className="flex gap-[2rem] flex-col items-center justify-center h-full">
        <img
          src="/logo.png"
          alt="logo"
          style={{ imageRendering: 'pixelated' }}
          className="h-[8rem] w-[28rem] flex-none"
        />
        <SpriteText>CONTINUE</SpriteText>
      </div>
    </div>
  )
}

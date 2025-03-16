import { useEffect, useState } from 'react'
import { Icon } from './Icon'

export function InsertAnim() {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % 3)
    }, 200)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <>
      <Icon color={count === 2 ? '#FFFFFF' : '#707070'}>{'<'}</Icon>
      <Icon color={count === 1 ? '#FFFFFF' : '#707070'}>{'<'}</Icon>
      <Icon color={count === 0 ? '#FFFFFF' : '#707070'}>{'<'}</Icon>
    </>
  )
}

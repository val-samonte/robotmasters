import cn from 'classnames'
import { SpriteText } from '../components/SpriteText'
import { Link } from 'react-router'
import { useMemo, useState } from 'react'

const heads = [
  {
    power: 0,
    weight: 3,
  },
  {
    power: 0,
    weight: 5,
  },
]

const bodies = [
  {
    power: 16,
    weight: 8,
  },
  {
    power: 20,
    weight: 12,
  },
]

const legss = [
  {
    power: 0,
    weight: 5,
  },
  {
    power: 0,
    weight: 8,
  },
]

export function CharacterCreationScreen() {
  const [head, setHead] = useState(0)
  const [body, setBody] = useState(0)
  const [legs, setLegs] = useState(0)

  const { weight, power } = useMemo(() => {
    if (head === 0 || body === 0 || legs === 0) {
      return { weight: '-', power: '-' }
    }
    return {
      power:
        heads[head - 1].power + bodies[body - 1].power + legss[legs - 1].power,
      weight:
        heads[head - 1].weight +
        bodies[body - 1].weight +
        legss[legs - 1].weight,
    }
  }, [head, body, legs])

  return (
    <div className="flex gap-[1rem] items-center justify-center h-full">
      <div className="flex gap-[1rem] flex-col ">
        <div className="flex flex-col border-white border-[0.2em] bg-black p-4 gap-[0.5rem]">
          <SpriteText>HEAD</SpriteText>
          <div className="flex gap-[1rem]">
            <div
              onClick={() => setHead(1)}
              className={cn(
                'flex gap-[0.5rem] items-center p-2',
                head === 1 && 'bg-blue-400'
              )}
            >
              <img
                src="/head_light.png"
                alt="head_light"
                className="w-[2rem] h-[2rem]"
              />
              <div className="flex flex-col gap-[0.5rem]">
                <SpriteText>LIGHT</SpriteText>
              </div>
            </div>
            <div
              onClick={() => setHead(2)}
              className={cn(
                'flex gap-[0.5rem] items-center p-2',
                head === 2 && 'bg-blue-400'
              )}
            >
              <img
                src="/head_heavy.png"
                alt="head_heavy"
                className="w-[2rem] h-[2rem]"
              />
              <div className="flex flex-col gap-[0.5rem]">
                <SpriteText>HEAVY</SpriteText>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-white border-[0.2em] bg-black p-4 gap-[0.5rem]">
          <SpriteText>BODY</SpriteText>
          <div className="flex gap-[1rem]">
            <div
              onClick={() => setBody(1)}
              className={cn(
                'flex gap-[0.5rem] items-center p-2',
                body === 1 && 'bg-blue-400'
              )}
            >
              <img
                src="/body_light.png"
                alt="body_light"
                className="w-[2rem] h-[2rem]"
              />
              <div className="flex flex-col gap-[0.5rem]">
                <SpriteText>LIGHT</SpriteText>
              </div>
            </div>
            <div
              onClick={() => setBody(2)}
              className={cn(
                'flex gap-[0.5rem] items-center p-2',
                body === 2 && 'bg-blue-400'
              )}
            >
              <img
                src="/body_heavy.png"
                alt="body_heavy"
                className="w-[2rem] h-[2rem]"
              />
              <div className="flex flex-col gap-[0.5rem]">
                <SpriteText>HEAVY</SpriteText>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-white border-[0.2em] bg-black p-4 gap-[0.5rem]">
          <SpriteText>LEGS</SpriteText>
          <div className="flex gap-[1rem]">
            <div
              onClick={() => setLegs(1)}
              className={cn(
                'flex gap-[0.5rem] items-center p-2',
                legs === 1 && 'bg-blue-400'
              )}
            >
              <img
                src="/legs_light.png"
                alt="legs_light"
                className="w-[2rem] h-[2rem]"
              />
              <div className="flex flex-col gap-[0.5rem]">
                <SpriteText>LIGHT</SpriteText>
              </div>
            </div>
            <div
              onClick={() => setLegs(2)}
              className={cn(
                'flex gap-[0.5rem] items-center p-2',
                legs === 2 && 'bg-blue-400'
              )}
            >
              <img
                src="/legs_heavy.png"
                alt="legs_heavy"
                className="w-[2rem] h-[2rem]"
              />
              <div className="flex flex-col gap-[0.5rem]">
                <SpriteText>HEAVY</SpriteText>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-white border-[0.2em] bg-black p-4 gap-[1rem] h-[22.5em]">
        <SpriteText>STATS</SpriteText>
        <div className="flex flex-col gap-[0.5rem] min-w-[14rem]">
          <div className="flex justify-between ">
            <SpriteText>HP</SpriteText>
            <SpriteText>100</SpriteText>
          </div>
          <div className="flex justify-between">
            <SpriteText>ENERGY</SpriteText>
            <SpriteText>100</SpriteText>
          </div>
          <div className="flex justify-between">
            <SpriteText>GENERATOR</SpriteText>
            <SpriteText>1.1</SpriteText>
          </div>
          <div className="flex justify-between">
            <SpriteText>POWER</SpriteText>
            <SpriteText>{power}</SpriteText>
          </div>
          <div className="flex justify-between">
            <SpriteText>WEIGHT</SpriteText>
            <SpriteText>{weight}</SpriteText>
          </div>
        </div>
        <div className="flex flex-auto items-center justify-center">
          <img src="/char.png" className="w-[4rem] h-[4rem]" />
        </div>
        <div>
          <Link to="/custom_behavior" className="flex justify-center">
            <SpriteText>NEXT</SpriteText>
          </Link>
        </div>
      </div>
    </div>
  )
}

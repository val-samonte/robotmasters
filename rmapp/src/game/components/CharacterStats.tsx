import { useMemo } from 'react'
import { itemDetails } from '../itemList'
import { SpriteText } from './SpriteText'
import { CharacterPreview } from './CharacterPreview'
import cn from 'classnames'

export interface CharacterStatsProps {
  head: string
  body: string
  legs: string
  weapon: string
}

export function CharacterStats({
  head,
  body,
  legs,
  weapon,
}: CharacterStatsProps) {
  const overallStats = useMemo(() => {
    let generator =
      itemDetails['body_' + body].details?.stats?.find(
        ([key]: any) => key === 'GEN'
      )[1] ?? '1:1'
    let power =
      itemDetails['body_' + body].details?.stats?.find(
        ([key]: any) => key === 'POW'
      )[1] ?? 0
    let weight =
      (itemDetails['head_' + head].details?.stats?.find(
        ([key]: any) => key === 'WGT'
      )[1] ?? 0) +
      (itemDetails['body_' + body].details?.stats?.find(
        ([key]: any) => key === 'WGT'
      )[1] ?? 0) +
      (itemDetails['legs_' + legs].details?.stats?.find(
        ([key]: any) => key === 'WGT'
      )[1] ?? 0) +
      (itemDetails[weapon].details?.stats?.find(
        ([key]: any) => key === 'WGT'
      )[1] ?? 0)

    let overweight = power / weight

    const armor: number[] = [
      0, // punct
      0, // blast
    ]
    itemDetails['head_' + head].details.protection.forEach(
      ([elem, val]: any) => {
        if (elem === 'punct') {
          armor[0] += val
        } else if (elem === 'blast') {
          armor[1] += val
        }
      }
    )
    itemDetails['body_' + body].details.protection.forEach(
      ([elem, val]: any) => {
        if (elem === 'punct') {
          armor[0] += val
        } else if (elem === 'blast') {
          armor[1] += val
        }
      }
    )
    itemDetails['legs_' + legs].details.protection.forEach(
      ([elem, val]: any) => {
        if (elem === 'punct') {
          armor[0] += val
        } else if (elem === 'blast') {
          armor[1] += val
        }
      }
    )

    return {
      stats: [
        ['HP', 100],
        ['ENRG', 100],
        ['POW', power],
        ['GEN', generator],
        ['WGT', weight],
      ],
      overweight,
      armor,
    }
  }, [head, body, legs, weapon])

  return (
    <div className="flex flex-col flex-auto gap-[1rem]">
      <div className="flex items-center justify-center p-[1em] pointer-events-none">
        <CharacterPreview head={head} body={body} legs={legs} weapon={weapon} />
      </div>
      <div
        className={cn(
          'flex p-[0.5rem] justify-center items-center',
          overallStats.overweight >= 1 && 'opacity-0'
        )}
      >
        <SpriteText color="#D82800">OVERWEIGHT</SpriteText>
      </div>
      <div className="flex flex-col px-[0.5rem] gap-[1rem]">
        {overallStats.stats.map(([key, val]: any, i: number) => (
          <div
            key={`${key}_${i}`}
            className="flex items-center justify-between"
          >
            <SpriteText>{key.toUpperCase()}</SpriteText>
            <SpriteText>{val + ''}</SpriteText>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="px-[0.5rem]">
          <SpriteText>ARMOR</SpriteText>
        </div>
        <div className="flex flex-wrap px-[0.5rem] gap-[1rem]">
          {overallStats.armor.map((val: number, i: number) => {
            if (val === 0) return null
            const key = ['punct', 'blast'][i]
            return (
              <div
                key={`armor_${i}`}
                className="flex items-center gap-[0.25rem]"
              >
                <img
                  src={`/elem_${key}.png`}
                  alt={`elem_${key}`}
                  className="w-[1rem] h-[1rem]"
                />
                <SpriteText>{val}</SpriteText>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { itemDetails } from '../itemList'
import { SpriteText } from './SpriteText'
import { CharacterPreview } from './CharacterPreview'
import cn from 'classnames'
import { ElemLabel } from './ElemLabel'
import { Slice9 } from './Slice9'
import { Tab } from './Tab'
import { Icon } from './Icon'

export interface CharacterStatsProps {
  head: string
  body: string
  legs: string
  weapon: string
}

export function CharacterPanel(props: CharacterStatsProps) {
  const [tab, setTab] = useState('s')

  return (
    <div className="flex flex-col h-full -gap-[0.25rem]">
      <div className="relative h-[8rem]">
        <img src="/mug_bg.png" className="w-[24rem]" />
        <div className="flex items-center justify-center p-[1em] pointer-events-none absolute inset-0">
          <CharacterPreview {...props} />
        </div>
      </div>
      <div className="flex flex-col flex-auto">
        <div className="flex px-[1rem] h-[2rem]">
          {['s', 'p', 'c', 'a', 'r'].map((t: string) => (
            <Tab
              key={t}
              asIcon={true}
              active={t === tab}
              onClick={() => {
                setTab(t)
              }}
            >
              {t}
            </Tab>
          ))}
        </div>
        <Slice9 className="relative flex-auto">
          <div className="h-full flex flex-col gap-[1rem]">
            {tab === 's' && <OverallStats {...props} />}
            {tab === 'p' && <Parts {...props} />}
            {tab === 'c' && <CPU {...props} />}
            {tab === 'a' && <Actions {...props} />}
            {tab === 'r' && <Armor {...props} />}
          </div>
        </Slice9>
      </div>
    </div>
  )
}

function OverallStats({ head, body, legs, weapon }: CharacterStatsProps) {
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

    let weightRatio = power / weight

    const armor: number[] = [
      0, // punct
      0, // blast
    ]
    itemDetails['head_' + head].details.protection.forEach(
      ([elem, val]: any) => {
        if (elem === 'P') {
          armor[0] += val
        } else if (elem === 'B') {
          armor[1] += val
        }
      }
    )
    itemDetails['body_' + body].details.protection.forEach(
      ([elem, val]: any) => {
        if (elem === 'P') {
          armor[0] += val
        } else if (elem === 'B') {
          armor[1] += val
        }
      }
    )
    itemDetails['legs_' + legs].details.protection.forEach(
      ([elem, val]: any) => {
        if (elem === 'P') {
          armor[0] += val
        } else if (elem === 'B') {
          armor[1] += val
        }
      }
    )

    return {
      stats: [
        ['HP', 100],
        ['ENG', 100],
        ['GEN', generator],
        ['POW', power],
        ['WGT', weight],
      ],
      weightRatio,
      armor,
    }
  }, [head, body, legs, weapon])

  return (
    <div className="flex flex-col gap-[1rem]">
      <SpriteText color="#38B8F8">STATS</SpriteText>
      {overallStats.stats.map(([key, val]: any, i: number) => {
        const overweight =
          (key === 'POW' || key === 'WGT') && overallStats.weightRatio < 1
        return (
          <div
            key={`${key}_${i}`}
            className="flex items-center justify-between"
          >
            <SpriteText color={overweight ? '#F89838' : '#FFFFFF'}>
              {key.toUpperCase()}
            </SpriteText>
            <SpriteText color={overweight ? '#F89838' : '#FFFFFF'}>
              {val + ''}
            </SpriteText>
          </div>
        )
      })}
    </div>
  )
}

function Parts(_: CharacterStatsProps) {
  return (
    <div className="flex flex-col gap-[1rem]">
      <SpriteText color="#38B8F8">PARTS</SpriteText>
    </div>
  )
}

function CPU(_: CharacterStatsProps) {
  return (
    <div className="flex flex-col gap-[1rem]">
      <SpriteText color="#38B8F8">CPU</SpriteText>
    </div>
  )
}

function Actions({ head, body, legs, weapon }: CharacterStatsProps) {
  const actions = useMemo(() => {
    const actions: [string, number][] = [
      ...(itemDetails['head_' + head].details.actions ?? []),
      ...(itemDetails['body_' + body].details.actions ?? []),
      ...(itemDetails['legs_' + legs].details.actions ?? []),
      ...(itemDetails[weapon].details.actions ?? []),
    ]

    return actions
  }, [head, body, legs, weapon])
  return (
    <div className="h-full flex flex-col">
      <SpriteText color="#38B8F8" className="p-[0.5rem]">
        ACTIONS
      </SpriteText>
      <div className="flex-auto relative">
        <div className="inset-0 absolute flex flex-col py-[0.5rem] gap-[1rem] overflow-auto">
          {actions.map(([action, cost]: any) => {
            return (
              <div
                key={action}
                className="flex items-center justify-between px-[0.5rem]"
              >
                <div className="">
                  <SpriteText>{action.toUpperCase()}</SpriteText>
                </div>
                <div className="flex gap-[0.25rem]">
                  <Icon>E</Icon>
                  <SpriteText>{cost}</SpriteText>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Armor(_: CharacterStatsProps) {
  return (
    <div className="flex flex-col gap-[1rem]">
      <SpriteText color="#38B8F8">PROTECTION</SpriteText>
    </div>
  )
}

{
  {
    /* <div
        className={cn(
          'flex p-[0.5rem] justify-center items-center',
          overallStats.overweight >= 1 && 'opacity-0'
        )}
      >
        <SpriteText color="#D82800">OVERWEIGHT</SpriteText>
      </div> */
  }
}

// <div className="flex justify-between items-center">
//         <div className="px-[0.5rem]">
//           <SpriteText>ARMOR</SpriteText>
//         </div>
//         <div className="flex flex-wrap px-[0.5rem] gap-[1rem]">
//           {overallStats.armor.map((val: number, i: number) => {
//             if (val === 0) return null
//             const elem = ['P', 'B'][i]
//             return (
//               <ElemLabel key={i} value={elem}>
//                 {val}
//               </ElemLabel>
//             )
//           })}
//         </div>
//       </div>

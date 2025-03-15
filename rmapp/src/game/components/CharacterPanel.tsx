import { ReactNode, useMemo, useState } from 'react'
import { itemDetails } from '../itemList'
import { SpriteText } from './SpriteText'
import { CharacterPreview } from './CharacterPreview'
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
        <img src="/mug_bg.png" className="w-[24rem]" draggable="false" />
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

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="h-full flex flex-col">
      <SpriteText color="#38B8F8" className="p-[0.5rem]">
        {title.toUpperCase()}
      </SpriteText>
      <div className="flex-auto relative">
        <div className="inset-0 absolute flex flex-col py-[0.5rem] gap-[1rem] overflow-auto custom-scroll">
          {children}
        </div>
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

    return {
      stats: [
        ['HP', 100],
        ['ENG', 100],
        ['GEN', generator],
        ['POW', power],
        ['WGT', weight],
      ],
      weightRatio,
    }
  }, [head, body, legs, weapon])

  return (
    <Panel title="STATS">
      {overallStats.stats.map(([key, val]: any, i: number) => {
        const overweight =
          (key === 'POW' || key === 'WGT') && overallStats.weightRatio < 1
        return (
          <div
            key={`${key}_${i}`}
            className="flex items-center justify-between px-[0.5rem]"
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
    </Panel>
  )
}

function Parts({ head, body, legs, weapon }: CharacterStatsProps) {
  return (
    <Panel title="PARTS">
      <div className="px-[0.5rem] flex flex-col gap-[0.25rem]">
        <div className="flex items-center gap-[0.5rem] justify-between">
          <SpriteText>{itemDetails[weapon].name}</SpriteText>
          <img
            src={`${itemDetails[weapon].details.img}`}
            alt={itemDetails[weapon].name}
            className="w-[4rem] h-[2rem]"
            draggable={false}
          />
        </div>
        <div className="flex items-center gap-[0.5rem] justify-between">
          <SpriteText>
            {itemDetails['head_' + head].name.replace('HEAD', '')}
          </SpriteText>
          <img
            src={`${itemDetails['head_' + head].details.img}`}
            alt={itemDetails['head_' + head].name}
            className="w-[2rem] h-[2rem]"
            draggable={false}
          />
        </div>
        <div className="flex items-center gap-[0.5rem] justify-between">
          <SpriteText>
            {itemDetails['body_' + body].name.replace('BODY', '')}
          </SpriteText>
          <img
            src={`${itemDetails['body_' + body].details.img}`}
            alt={itemDetails['body_' + body].name}
            className="w-[2rem] h-[2rem]"
            draggable={false}
          />
        </div>
        <div className="flex items-center gap-[0.5rem] justify-between">
          <SpriteText>
            {itemDetails['legs_' + legs].name.replace('LEGS', '')}
          </SpriteText>
          <img
            src={`${itemDetails['legs_' + legs].details.img}`}
            alt={itemDetails['legs_' + legs].name}
            className="w-[2rem] h-[2rem]"
            draggable={false}
          />
        </div>
      </div>
    </Panel>
  )
}

function CPU({ head }: CharacterStatsProps) {
  return (
    <Panel title={`CPU`}>
      <div className="flex flex-col gap-[0.25rem]">
        {[...itemDetails['head_' + head].details.cpu, 'always'].map(
          (name: string, i: number) => {
            return (
              <div
                key={name + '_' + i}
                className="flex items-center justify-between px-[0.5rem]"
              >
                <Slice9 frameUrl="/cpu_frame.png">
                  <div className="pr-[0.25rem] flex gap-[0.5rem]">
                    <SpriteText color="#F8E0A0">{i + 1}</SpriteText>
                    <SpriteText>{name.toUpperCase()}</SpriteText>
                  </div>
                </Slice9>
              </div>
            )
          }
        )}
      </div>
    </Panel>
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
    <Panel title="ACTIONS">
      <div className="flex flex-col gap-[0.25rem]">
        {actions.map(([action, cost]: any) => {
          return (
            <div
              key={action}
              className="flex items-center justify-between px-[0.5rem]"
            >
              <Slice9 frameUrl="/action_frame.png">
                <div className="pl-[0.25rem] flex gap-[0.5rem]">
                  <SpriteText>{action.toUpperCase()}</SpriteText>
                </div>
              </Slice9>
              <div className="flex gap-[0.25rem]">
                <Icon>E</Icon>
                <SpriteText>{cost}</SpriteText>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function Armor({ head, body, legs }: CharacterStatsProps) {
  const armor = useMemo(() => {
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
    return armor
  }, [head, body, legs])

  return (
    <Panel title="ARMOR">
      {armor.map((val: number, i: number) => {
        if (val === 0) return null
        const elem = ['P', 'B'][i]
        return (
          <div
            key={val}
            className="flex items-center justify-between px-[0.5rem]"
          >
            <ElemLabel key={i} value={elem} />
            <SpriteText>{val}</SpriteText>
          </div>
        )
      })}
    </Panel>
  )
}

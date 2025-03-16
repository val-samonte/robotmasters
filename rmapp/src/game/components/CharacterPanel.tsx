import { useMemo, useState } from 'react'
import { itemDetails, statTips } from '../itemList'
import { SpriteText } from './SpriteText'
import { CharacterPreview } from './CharacterPreview'
import { ElemLabel } from './ElemLabel'
import { Slice9 } from './Slice9'
import { Tab } from './Tab'
import { Icon } from './Icon'
import { Panel } from './Panel'
import { Item } from './Item'
import { CpuChip } from './CpuChip'
import { HelpTip } from './HelpTip'

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
          {tab === 's' && <OverallStats {...props} />}
          {tab === 'p' && <Parts {...props} />}
          {tab === 'c' && <CPU {...props} />}
          {tab === 'a' && <Actions {...props} />}
          {tab === 'r' && <Armor {...props} />}
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
          <HelpTip
            title={statTips[key].title}
            message={statTips[key].message}
            key={`${key}_${i}`}
            className="flex px-[0.5rem]"
          >
            <SpriteText color={overweight ? '#F89838' : '#FFFFFF'}>
              {key.toUpperCase()}
            </SpriteText>
            <SpriteText color={overweight ? '#F89838' : '#FFFFFF'}>
              {val + ''}
            </SpriteText>
          </HelpTip>
        )
      })}
    </Panel>
  )
}

function Parts({ head, body, legs, weapon }: CharacterStatsProps) {
  return (
    <Panel title="PARTS">
      <div className="flex flex-col gap-[0.25rem]">
        <Item
          name={itemDetails[weapon].name}
          src={itemDetails[weapon].details.img}
          className="w-[4rem] h-[2rem]"
        />
        <Item
          name={itemDetails['head_' + head].name.replace('HEAD', '')}
          src={itemDetails['head_' + head].details.img}
          className="w-[4rem] h-[2rem]"
        />
        <Item
          name={itemDetails['body_' + body].name.replace('BODY', '')}
          src={itemDetails['body_' + body].details.img}
          className="w-[4rem] h-[2rem]"
        />
        <Item
          name={itemDetails['legs_' + legs].name.replace('LEGS', '')}
          src={itemDetails['legs_' + legs].details.img}
          className="w-[4rem] h-[2rem]"
        />
      </div>
    </Panel>
  )
}

function CPU({ head }: CharacterStatsProps) {
  return (
    <Panel title={`CPU`}>
      <div className="flex flex-col gap-[0.25rem] px-[0.5rem]">
        {[...itemDetails['head_' + head].details.cpu, 'always'].map(
          (name: string, i: number) => (
            <CpuChip key={i} name={name} index={i} />
          )
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

import { Fragment, Suspense, useMemo, useState } from 'react'
import { itemDetails, statTips } from '../itemList'
import { SpriteText } from './SpriteText'
import { CharacterPreview } from './CharacterPreview'
import { ElemLabel } from './ElemLabel'
import { Slice9 } from './Slice9'
import { Tab } from './Tab'
import { Panel } from './Panel'
import { Item } from './Item'
import { CpuChip } from './CpuChip'
import { HelpTip } from './HelpTip'
import { ActionChip } from './ActionChip'
import { Icon } from './Icon'
import { useAtomValue } from 'jotai'
import { viewModeAtom } from '../../atoms/viewModeAtom'

export interface CharacterStatsProps {
  head: string
  body: string
  legs: string
  weapon: string
}

export function CharacterPanel(props: CharacterStatsProps) {
  return (
    <Suspense>
      <CharacterPanelInner {...props} />
    </Suspense>
  )
}

function CharacterPanelInner(props: CharacterStatsProps) {
  const { head, body, legs, weapon } = props
  const [tab, setTab] = useState('s')
  const viewMode = useAtomValue(viewModeAtom)

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
    <div className="flex flex-col portrait:flex-row h-full portrait:w-full -gap-[0.25rem]">
      <div className="relative landscape:h-[8rem] portrait:h-full portrait:w-[8rem]">
        <img
          src="/mug_bg.png"
          className="w-[24rem] portrait:hidden"
          draggable="false"
        />
        <div className="absolute inset-y-[0.25rem] left-[0rem] -right-[2rem] landscape:hidden">
          <Slice9 frameUrl="/plate.png" className="h-full w-full" />
        </div>
        <div className="flex items-center justify-center p-[1em] pointer-events-none absolute inset-0">
          <CharacterPreview {...props} />
        </div>
        <div className="absolute top-[1rem] left-[1rem]">
          {overallStats.weightRatio < 1 && (
            <HelpTip title="OVERWEIGHT!" message="Will move slower than usual.">
              <Icon>w</Icon>
            </HelpTip>
          )}
        </div>
      </div>
      <div className="flex flex-col portrait:flex-row flex-auto portrait:-space-x-[0.25rem]">
        <div className="flex portrait:flex-col landscape:px-[1rem] landscape:h-[2rem] portrait:py-[1rem]">
          {['s', 'p', 'c', 'a', 'r'].map((t: string) => (
            <Tab
              className="landscape:hidden"
              flip={viewMode === 1}
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
          {tab === 's' && (
            <OverallStats
              overallStats={overallStats.stats}
              overweight={overallStats.weightRatio < 1}
            />
          )}
          {tab === 'p' && <Parts {...props} />}
          {tab === 'c' && <CPU {...props} />}
          {tab === 'a' && <Actions {...props} />}
          {tab === 'r' && <Armor {...props} />}
        </Slice9>
      </div>
    </div>
  )
}

function OverallStats({
  overallStats,
  overweight,
}: {
  overallStats: any[]
  overweight: boolean
}) {
  return (
    <Panel title="STATS">
      <div className="grid portrait:grid-cols-2 landscape:grid-cols-1 gap-[1rem]">
        {overallStats.map(([key, val]: any, i: number) => {
          const isOverweight = (key === 'POW' || key === 'WGT') && overweight
          return (
            <HelpTip
              title={statTips[key].title}
              message={statTips[key].message}
              key={`${key}_${i}`}
              className="flex px-[0.5rem]"
            >
              <SpriteText color={isOverweight ? '#F89838' : '#FFFFFF'}>
                {key.toUpperCase()}
              </SpriteText>
              <SpriteText color={isOverweight ? '#F89838' : '#FFFFFF'}>
                {val + ''}
              </SpriteText>
            </HelpTip>
          )
        })}
      </div>
    </Panel>
  )
}

function Parts({ head, body, legs, weapon }: CharacterStatsProps) {
  return (
    <Panel title="PARTS">
      <div className="grid portrait:grid-cols-2 landscape:grid-cols-1 gap-[0.25rem]">
        <HelpTip
          title={itemDetails[weapon].name}
          message={itemDetails[weapon].desc}
        >
          <Item
            name={itemDetails[weapon].name}
            src={itemDetails[weapon].details.img}
            className="w-[4rem] h-[2rem]"
          />
        </HelpTip>
        <HelpTip
          title={itemDetails['head_' + head].name}
          message={itemDetails['head_' + head].desc}
        >
          <Item
            name={itemDetails['head_' + head].name.replace('HEAD', '')}
            src={itemDetails['head_' + head].details.img}
            className="w-[4rem] h-[2rem]"
          />
        </HelpTip>
        <HelpTip
          title={itemDetails['body_' + body].name}
          message={itemDetails['body_' + body].desc}
        >
          <Item
            name={itemDetails['body_' + body].name.replace('BODY', '')}
            src={itemDetails['body_' + body].details.img}
            className="w-[4rem] h-[2rem]"
          />
        </HelpTip>
        <HelpTip
          title={itemDetails['legs_' + legs].name}
          message={itemDetails['legs_' + legs].desc}
        >
          <Item
            name={itemDetails['legs_' + legs].name.replace('LEGS', '')}
            src={itemDetails['legs_' + legs].details.img}
            className="w-[4rem] h-[2rem]"
          />
        </HelpTip>
      </div>
    </Panel>
  )
}

function CPU({ head }: CharacterStatsProps) {
  return (
    <Panel title={`CPU`}>
      <div className="grid portrait:grid-cols-2 landscape:grid-cols-1 gap-[0.25rem] px-[0.5rem] gap-x-[1rem]">
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
      <div className="grid portrait:grid-cols-2 landscape:grid-cols-1 gap-[0.25rem] px-[0.5rem] gap-x-[1rem]">
        {actions.map(([action, cost]: any, i: number) => (
          <ActionChip key={i} name={action} cost={cost} />
        ))}
      </div>
    </Panel>
  )
}

function Armor({ head, body, legs }: CharacterStatsProps) {
  const armor = useMemo(() => {
    const armor = [
      0, // Punct
      0, // Blast
      0, // Force
      0, // Sever
      0, // Heat
      0, // Cryo
      0, // Jolt
      0, // Virus
    ]

    ;[
      itemDetails['head_' + head],
      itemDetails['body_' + body],
      itemDetails['legs_' + legs],
    ].forEach((part) => {
      part.details.protection.forEach(([elem, val]: [string, number]) => {
        const index = { P: 0, B: 1, F: 2, S: 3, H: 4, C: 5, J: 6, V: 7 }[elem]
        if (index === undefined) return
        armor[index] += val
      })
    })
    return armor
  }, [head, body, legs])

  return (
    <Panel title="ARMOR">
      <div className="grid portrait:grid-cols-2 landscape:grid-cols-1 gap-[1rem]">
        {armor.map((val: number, i: number) => {
          if (val === 0) return null
          const elem = ['P', 'B', 'F', 'S', 'H', 'C', 'J', 'V'][i]
          return (
            <div
              key={i}
              className="flex items-center justify-between px-[0.5rem]"
            >
              <ElemLabel key={i} value={elem} />
              <SpriteText>{val}</SpriteText>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

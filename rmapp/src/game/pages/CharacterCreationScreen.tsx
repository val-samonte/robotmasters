import { SpriteText } from '../components/SpriteText'
import { useEffect, useMemo, useState } from 'react'
import { itemDetails, paints, statTips } from '../itemList'
import { CharacterPanel } from '../components/CharacterPanel'
import { Link, useSearchParams } from 'react-router'
import { Slice9 } from '../components/Slice9'
import { Tab } from '../components/Tab'
import { Icon } from '../components/Icon'
import { ElemLabel } from '../components/ElemLabel'
import { Selectable } from '../components/Selectable'
import { Panel } from '../components/Panel'
import { Item } from '../components/Item'
import { useAtom } from 'jotai'
import { paintAtom } from '../../atoms/paintAtom'
import { HelpTip } from '../components/HelpTip'
import { CpuChip } from '../components/CpuChip'
import { ActionChip } from '../components/ActionChip'
import { HelpPanel } from '../components/HelpPanel'

export function CharacterCreationScreen() {
  const [tab, setTab] = useState('head')
  const [searchParams] = useSearchParams()
  const [head, setHead] = useState(searchParams.get('head') ?? '0')
  const [body, setBody] = useState(searchParams.get('body') ?? '0')
  const [legs, setLegs] = useState(searchParams.get('legs') ?? '0')
  const [weapon, setWeapon] = useState(searchParams.get('weapon') ?? 'hg_0')
  const [paint, setPaint] = useAtom(paintAtom)
  const [lastSelected, setLastSelected] = useState('')

  useEffect(() => {
    if (searchParams.has('paint')) {
      setPaint(searchParams.get('paint')!)
    }
  }, [searchParams])

  useEffect(() => {
    if (tab === 'color') {
      setLastSelected('')
      return
    }
    const id = { head: head, body: body, legs: legs }?.[tab]
    setLastSelected(id ? `${tab}_${id}` : weapon)
  }, [tab, head, body, legs, weapon])

  const params = useMemo(() => {
    const p = new URLSearchParams({
      head,
      body,
      legs,
      weapon,
      paint,
    })

    return p.toString()
  }, [head, body, legs, weapon, paint])

  return (
    <div className="w-full h-full items-center justify-center p-[1rem]">
      <div className="flex flex-col gap-[0.5rem] h-full">
        <Slice9 className="h-[4rem]">
          <div className="flex justify-between items-center h-full">
            <Link to={`/`} className="-translate-y-[0.125rem]">
              <Slice9 frameUrl="/button.png">
                <div className="flex gap-[0.125rem] px-[0.125rem]">
                  <Icon>{'<'}</Icon>
                  <SpriteText>PREV</SpriteText>
                </div>
              </Slice9>
            </Link>
            <SpriteText>CREATE ROBOT MASTER</SpriteText>
            <Link
              to={`/custom_cpu?${params}`}
              className="-translate-y-[0.125rem]"
            >
              <Slice9 frameUrl="/button.png">
                <div className="flex gap-[0.125rem] px-[0.125rem]">
                  <SpriteText>NEXT</SpriteText>
                  <Icon>{'>'}</Icon>
                </div>
              </Slice9>
            </Link>
          </div>
        </Slice9>

        <div className="flex-auto relative overflow-hidden">
          <div className="flex absolute inset-0 gap-[0.5rem]">
            <div className="w-[16rem] h-full flex-none">
              <CharacterPanel
                head={head}
                body={body}
                legs={legs}
                weapon={weapon}
              />
            </div>

            <div className="flex-auto flex flex-col">
              <div className="flex px-[0.5rem] h-[2rem]">
                <Tab active={tab === 'head'} onClick={() => setTab('head')}>
                  HEAD
                </Tab>
                <Tab active={tab === 'body'} onClick={() => setTab('body')}>
                  BODY
                </Tab>
                <Tab active={tab === 'legs'} onClick={() => setTab('legs')}>
                  LEGS
                </Tab>
                <Tab active={tab === 'weapon'} onClick={() => setTab('weapon')}>
                  WEAP
                </Tab>
                <Tab active={tab === 'color'} onClick={() => setTab('color')}>
                  COLR
                </Tab>
              </div>
              <Slice9 className="relative flex-auto">
                <div className="inset-0 absolute flex flex-col overflow-auto custom-scroll">
                  {tab !== 'color' && (
                    <div className="grid grid-cols-2 justify-around">
                      {Object.entries(itemDetails)
                        .filter(([_, i]: any) => i.type === tab)
                        .map(([id, i]: any) => {
                          const selected =
                            i.type === 'head'
                              ? head === id.replace('head_', '')
                              : i.type === 'body'
                              ? body === id.replace('body_', '')
                              : i.type === 'legs'
                              ? legs === id.replace('legs_', '')
                              : weapon === id

                          const onClick = () => {
                            switch (i.type) {
                              case 'head':
                                setHead(id.replace('head_', ''))
                                break
                              case 'body':
                                setBody(id.replace('body_', ''))
                                break
                              case 'legs':
                                setLegs(id.replace('legs_', ''))
                                break
                              case 'weapon':
                                setWeapon(id)
                                break
                            }
                            setLastSelected(id)
                          }

                          const name =
                            i.type === 'head'
                              ? i.name.replace('HEAD', '')
                              : i.type === 'body'
                              ? i.name.replace('BODY', '')
                              : i.type === 'legs'
                              ? i.name.replace('LEGS', '')
                              : i.name

                          return (
                            <HelpTip title={name} message={i.desc}>
                              <Selectable
                                key={id}
                                selected={selected}
                                onClick={onClick}
                                className="w-full"
                              >
                                <Item
                                  name={name}
                                  src={i.details.img}
                                  className={'w-[4rem] h-[2rem]'}
                                />
                              </Selectable>
                            </HelpTip>
                          )
                        })}
                    </div>
                  )}
                  {tab === 'color' && (
                    <div className="grid grid-cols-4 justify-around">
                      {paints.map((p) => (
                        <Selectable
                          key={p.id}
                          selected={paint === p.id}
                          onClick={() => setPaint(p.id)}
                        >
                          <Item
                            name={p.id.toUpperCase()}
                            src={'/paint.png'}
                            className={'w-[4rem] h-[2rem]'}
                            {...p}
                          />
                        </Selectable>
                      ))}
                    </div>
                  )}
                </div>
              </Slice9>
            </div>
            {lastSelected && (
              <Slice9 className="w-[16rem] h-full flex-none">
                {itemDetails[lastSelected]?.details && (
                  <Panel title={itemDetails[lastSelected].name}>
                    {itemDetails[lastSelected].details?.stats && (
                      <>
                        <div className="flex flex-col px-[0.5rem] gap-[1rem]">
                          {itemDetails[lastSelected].details.stats.map(
                            ([key, val]: any) => (
                              <HelpTip
                                title={statTips[key].title}
                                message={statTips[key].message}
                                key={key}
                              >
                                <SpriteText>{key}</SpriteText>
                                <div className="flex gap-[0.25rem]">
                                  {key === 'ELEM' ? (
                                    <ElemLabel value={val} />
                                  ) : (
                                    <SpriteText>
                                      {(val + '').toUpperCase()}
                                    </SpriteText>
                                  )}
                                </div>
                              </HelpTip>
                            )
                          )}
                        </div>
                      </>
                    )}
                    {itemDetails[lastSelected].details?.protection && (
                      <>
                        <div className="flex flex-col gap-[1rem]">
                          <div className=" px-[0.5rem]">
                            <SpriteText color="#38B8F8">ARMOR</SpriteText>
                          </div>
                          <div className="flex flex-col px-[0.5rem] gap-[1rem]">
                            {itemDetails[lastSelected].details.protection.map(
                              ([elem, pts]: any, i: number) => (
                                <div
                                  key={elem + '_' + i}
                                  className="flex items-center justify-between"
                                >
                                  <ElemLabel key={i} value={elem} />
                                  <SpriteText>{pts}</SpriteText>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    {itemDetails[lastSelected].details?.actions && (
                      <>
                        <div className="px-[0.5rem]">
                          <SpriteText color="#38B8F8">ACTIONS</SpriteText>
                        </div>
                        <div className="flex flex-col gap-[0.25rem] px-[0.5rem]">
                          {itemDetails[lastSelected].details.actions.map(
                            ([action, cost]: any, i: number) => (
                              <ActionChip key={i} name={action} cost={cost} />
                            )
                          )}
                        </div>
                      </>
                    )}
                    {itemDetails[lastSelected].details?.cpu && (
                      <>
                        <div className=" px-[0.5rem]">
                          <SpriteText color="#38B8F8">CPU</SpriteText>
                        </div>
                        <div className="flex flex-col gap-[0.25rem] px-[0.5rem]">
                          {[
                            ...itemDetails[lastSelected].details.cpu,
                            'always',
                          ].map((cpu: string, i: number) => (
                            <CpuChip key={i} name={cpu} index={i} />
                          ))}
                        </div>
                      </>
                    )}
                  </Panel>
                )}
              </Slice9>
            )}
          </div>
        </div>
        <HelpPanel>Please select parts and press NEXT.</HelpPanel>
      </div>
    </div>
  )
}

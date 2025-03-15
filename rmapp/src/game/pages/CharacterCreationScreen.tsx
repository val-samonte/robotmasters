import cn from 'classnames'
import { SpriteText } from '../components/SpriteText'
import { useMemo, useState } from 'react'
import { itemDetails } from '../itemList'
import { CharacterPanel } from '../components/CharacterPanel'
import { Link, useSearchParams } from 'react-router'
import { Slice9 } from '../components/Slice9'
import { Tab } from '../components/Tab'
import { Icon } from '../components/Icon'
import { ElemLabel } from '../components/ElemLabel'

const weapons = ['hg_0', 'hg_1', 'hg_2', 'gl_0', 'gl_1', 'gl_2']

export function CharacterCreationScreen() {
  const [tab, setTab] = useState('head')
  const [searchParams] = useSearchParams()
  const [head, setHead] = useState(searchParams.get('head') ?? '0')
  const [body, setBody] = useState(searchParams.get('body') ?? '0')
  const [legs, setLegs] = useState(searchParams.get('legs') ?? '0')
  const [weapon, setWeapon] = useState(searchParams.get('weapon') ?? 'hg_0')
  const [lastSelected, setLastSelected] = useState('')

  const params = useMemo(() => {
    const p = new URLSearchParams({
      head,
      body,
      legs,
      weapon,
    })
    return p.toString()
  }, [head, body, legs, weapon])

  return (
    <div className="w-full h-full items-center justify-center p-[1rem]">
      <div className="flex flex-col gap-[0.5rem] h-full">
        <Slice9>
          <div className="flex justify-center p-[0.5rem]">
            <SpriteText>CREATE ROBOT MASTER</SpriteText>
          </div>
        </Slice9>

        <div className="flex-auto relative overflow-hidden">
          <div className="flex absolute inset-0 gap-[0.5rem]">
            <div className="w-[16rem] h-full">
              <CharacterPanel
                head={head}
                body={body}
                legs={legs}
                weapon={weapon}
              />
            </div>

            <div className="flex-2 flex flex-col">
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
                <Tab active={tab === 'weap'} onClick={() => setTab('weap')}>
                  WEAP
                </Tab>
                <Tab active={tab === 'colr'} onClick={() => setTab('colr')}>
                  COLR
                </Tab>
              </div>
              <Slice9 className="relative">
                <div className="pt-[1rem] flex flex-col h-full">
                  <div className="flex flex-col flex-auto gap-[1rem]">
                    <div className="flex items-center justify-between px-[0.5rem]">
                      <SpriteText>HEAD</SpriteText>
                      <div className="flex gap-[1rem]">
                        <button
                          onClick={() => {
                            setHead('0')
                            setLastSelected('head_0')
                          }}
                          className={cn(
                            'cursor-pointer flex gap-[0.5rem] items-center',
                            head === '0' && 'bg-blue-400'
                          )}
                        >
                          <img
                            src="/head_light.png"
                            alt="head_light"
                            className="w-[2rem] h-[2rem]"
                            draggable={false}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setHead('2')
                            setLastSelected('head_2')
                          }}
                          className={cn(
                            'cursor-pointer flex gap-[0.5rem] items-center',
                            head === '2' && 'bg-blue-400'
                          )}
                        >
                          <img
                            src="/head_heavy.png"
                            alt="head_heavy"
                            className="w-[2rem] h-[2rem]"
                            draggable={false}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-[0.5rem]">
                      <SpriteText>BODY</SpriteText>
                      <div className="flex gap-[1rem]">
                        <button
                          onClick={() => {
                            setBody('0')
                            setLastSelected('body_0')
                          }}
                          className={cn(
                            'cursor-pointer flex gap-[0.5rem] items-center',
                            body === '0' && 'bg-blue-400'
                          )}
                        >
                          <img
                            src="/body_light.png"
                            alt="body_light"
                            className="w-[2rem] h-[2rem]"
                            draggable={false}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setBody('2')
                            setLastSelected('body_2')
                          }}
                          className={cn(
                            'cursor-pointer flex gap-[0.5rem] items-center',
                            body === '2' && 'bg-blue-400'
                          )}
                        >
                          <img
                            src="/body_heavy.png"
                            alt="body_heavy"
                            className="w-[2rem] h-[2rem]"
                            draggable={false}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-[0.5rem]">
                      <SpriteText>LEGS</SpriteText>
                      <div className="flex gap-[1rem]">
                        <button
                          onClick={() => {
                            setLegs('0')
                            setLastSelected('legs_0')
                          }}
                          className={cn(
                            'cursor-pointer flex gap-[0.5rem] items-center',
                            legs === '0' && 'bg-blue-400'
                          )}
                        >
                          <img
                            src="/legs_light.png"
                            alt="legs_light"
                            className="w-[2rem] h-[2rem]"
                            draggable={false}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setLegs('2')
                            setLastSelected('legs_2')
                          }}
                          className={cn(
                            'cursor-pointer flex gap-[0.5rem] items-center',
                            legs === '2' && 'bg-blue-400'
                          )}
                        >
                          <img
                            src="/legs_heavy.png"
                            alt="legs_heavy"
                            className="w-[2rem] h-[2rem]"
                            draggable={false}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col px-[0.5rem] gap-[1rem]">
                      <SpriteText>WEAPON</SpriteText>
                      <div className="flex flex-wrap gap-[1rem]">
                        {weapons.map((name) => (
                          <button
                            key={name}
                            onClick={() => {
                              setWeapon(name)
                              setLastSelected(name)
                            }}
                            className={cn(
                              'cursor-pointer flex gap-[0.5rem] items-center',
                              weapon === name && 'bg-blue-400'
                            )}
                          >
                            <img
                              src={`/${name}.png`}
                              alt={name}
                              className="w-[4rem] h-[2rem]"
                              draggable={false}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto p-[1rem] border-white border-t-[0.125em] flex justify-center">
                    <Link to={`/custom_cpu?${params}`}>
                      <SpriteText>NEXT</SpriteText>
                    </Link>
                  </div>
                </div>
              </Slice9>
            </div>
            <Slice9 className="flex-1">
              <div className="py-[0.5rem]">
                {itemDetails[lastSelected]?.details && (
                  <div className="flex flex-col gap-[1rem]">
                    <div className="flex px-[0.5rem] justify-between items-center">
                      {itemDetails[lastSelected]?.name && (
                        <SpriteText>
                          {itemDetails[lastSelected].name}
                        </SpriteText>
                      )}
                    </div>

                    {itemDetails[lastSelected].details?.stats && (
                      <>
                        <div className="flex flex-col px-[0.5rem] gap-[1rem]">
                          {itemDetails[lastSelected].details.stats.map(
                            ([key, val]: any) => (
                              <div
                                key={key}
                                className="flex items-center justify-between"
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
                              </div>
                            )
                          )}
                        </div>
                      </>
                    )}
                    {itemDetails[lastSelected].details?.protection && (
                      <>
                        <div className="flex justify-between items-center">
                          <div className=" px-[0.5rem]">
                            <SpriteText>ARMOR</SpriteText>
                          </div>
                          <div className="flex flex-wrap px-[0.5rem] gap-[1rem]">
                            {itemDetails[lastSelected].details.protection.map(
                              ([elem, pts]: any, i: number) => (
                                <ElemLabel key={i} value={elem}>
                                  {pts}
                                </ElemLabel>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    {itemDetails[lastSelected].details?.actions && (
                      <>
                        <div className=" px-[0.5rem]">
                          <SpriteText>ACTIONS</SpriteText>
                        </div>
                        <div className="flex flex-col px-[0.5rem] gap-[1rem]">
                          {itemDetails[lastSelected].details.actions.map(
                            ([action, cost]: any) => (
                              <div
                                key={action}
                                className="flex items-center justify-between"
                              >
                                <SpriteText>{action.toUpperCase()}</SpriteText>
                                <div className="flex gap-[0.25rem]">
                                  <Icon>E</Icon>
                                  <SpriteText>{cost}</SpriteText>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </>
                    )}
                    {itemDetails[lastSelected].details?.cpu && (
                      <>
                        <div className=" px-[0.5rem]">
                          <SpriteText>CPU</SpriteText>
                        </div>
                        <div className="flex flex-col px-[0.5rem] gap-[1rem]">
                          {itemDetails[lastSelected].details.cpu.map(
                            (cpu: string, i: number) => (
                              <div
                                key={`${cpu}_${i}`}
                                className="flex items-center justify-between"
                              >
                                <SpriteText>{i + 1}</SpriteText>
                                <SpriteText>{cpu.toUpperCase()}</SpriteText>
                              </div>
                            )
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Slice9>
          </div>
        </div>

        <Slice9>
          <div className="p-[0.5rem] flex flex-col gap-[0.5rem] landscape:h-[3.5rem] overflow-auto">
            {itemDetails[lastSelected]?.name && (
              <SpriteText>{itemDetails[lastSelected].name}</SpriteText>
            )}
            {itemDetails[lastSelected]?.desc && (
              <SpriteText>{itemDetails[lastSelected].desc}</SpriteText>
            )}
          </div>
        </Slice9>
      </div>
    </div>
  )
}

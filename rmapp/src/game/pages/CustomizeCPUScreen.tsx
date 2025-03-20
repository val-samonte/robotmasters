import { Link, useSearchParams } from 'react-router'
import { SpriteText } from '../components/SpriteText'
import { CharacterPanel } from '../components/CharacterPanel'
import { itemDetails } from '../itemList'
import { useEffect, useMemo, useRef, useState } from 'react'
import cn from 'classnames'
import { useSetAtom } from 'jotai'
import { paintAtom } from '../../atoms/paintAtom'
import { Slice9 } from '../components/Slice9'
import { Icon } from '../components/Icon'
import { Panel } from '../components/Panel'
import { CpuChip } from '../components/CpuChip'
import { InsertAnim } from '../components/InsertAnim'
import { ActionChip } from '../components/ActionChip'
import { Button } from '../components/Button'
import { GameEgine } from '../components/GameEngine'
import { actionLookup, cpuLookup } from '../constants'
import { HelpPanel } from '../components/HelpPanel'

export function CustomizeCPUScreen() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState<number | null>(null)
  const [mapping, setMapping] = useState<(number | undefined)[]>([])
  const setPaint = useSetAtom(paintAtom)
  const [pause, setPause] = useState(false)

  const head = searchParams.get('head') ?? '0'
  const body = searchParams.get('body') ?? '0'
  const legs = searchParams.get('legs') ?? '0'
  const weapon = searchParams.get('weapon') ?? 'hg_0'
  const hData = itemDetails['head_' + head]
  const bData = itemDetails['body_' + body]
  const lData = itemDetails['legs_' + legs]
  const wData = itemDetails[weapon]

  useEffect(() => {
    if (searchParams.has('paint')) {
      setPaint(searchParams.get('paint')!)
    }
  }, [searchParams])

  const { actions, weight, protections } = useMemo(() => {
    const actions: [string, number][] = [
      ...(hData.details.actions ?? []),
      ...(bData.details.actions ?? []),
      ...(lData.details.actions ?? []),
      ...(wData.details.actions ?? []),
    ]

    const weight = [hData, bData, lData, wData].reduce((sum, cur) => {
      return (
        sum + (cur.details.stats.find(([key]: any) => key === 'WGT')?.[1] ?? 0)
      )
    }, 0)

    const protections = [
      0, // Punct
      0, // Blast
      0, // Force
      0, // Sever
      0, // Heat
      0, // Cryo
      0, // Jolt
      0, // Virus
    ]

    ;[hData, bData, lData].forEach((part) => {
      part.details.protection.forEach(([elem, val]: [string, number]) => {
        const index = { P: 0, B: 1, H: 4 }[elem]
        if (index === undefined) return
        protections[index] += val
      })
    })

    return { actions, weight, protections }
  }, [searchParams])

  const { behaviors, ...gameEngineProps } = useMemo(() => {
    // let generator = bData.details.stats.find(
    //   ([key]: any) => key === 'GEN'
    // )[1] ?? '1:1'

    const power =
      bData.details.stats.find(([key]: any) => key === 'POW')[1] ?? 0

    const potential = Math.min(power / weight, 1)
    const jump_force = -750 - Math.floor(100 * potential)
    const move_speed = 125 + Math.floor(125 * potential)

    const behaviors = [...hData.details.cpu, 'always']
      .map((name: string, i) => {
        if (mapping[i] === undefined) return undefined
        const cpuIndex = cpuLookup.findIndex((k) => k === name)
        if (cpuIndex === -1) return undefined
        const [actionName, cost] = actions[mapping[i]]
        const actionIndex = actionLookup.findIndex((k) => k === actionName)
        if (actionIndex === -1) return undefined
        return [cpuIndex, actionIndex, cost]
      })
      .filter((i) => i !== undefined) as number[][]

    return {
      behaviors,
      demo: true,
      gravity: 0.5,
      mapId: 'demo',
      objects: [
        {
          id: 'demo_player',
          group: 0,
          x: 0,
          y: 0,
          facing_right: true,
          width: 16,
          height: 28,
          behaviors,
          jump_force,
          move_speed,
          weapons: [[...wData.data]],
          protections,
        },
        {
          id: 'demo_player2',
          group: 1,
          x: 0,
          y: 0,
          facing_right: true,
          width: 16,
          height: 28,
          behaviors,
          jump_force,
          move_speed,
          weapons: [[...wData.data]],
          protections,
        },
      ],
      seed: 333,
    }
  }, [mapping, actions, weight, protections])

  const initializedBehaviors = useRef(false)
  useEffect(() => {
    if (searchParams.has('behaviors') && !initializedBehaviors.current) {
      initializedBehaviors.current = true
      const behaviors = JSON.parse(searchParams.get('behaviors') ?? '[]')
      const mappings: (number | undefined)[] = []
      behaviors.forEach(([cpuIndex, actionIndex]: number[]) => {
        const cpuName = cpuLookup[cpuIndex]
        const index = [...hData.details.cpu, 'always'].findIndex(
          (i: string) => i === cpuName
        )
        const actionName = actionLookup[actionIndex]
        const actionListIndex = actions.findIndex((i) => i[0] === actionName)

        if (index > -1) {
          mappings[index] = actionListIndex
        }
      })
      setMapping(mappings)
    }
  }, [actions])

  useEffect(() => {
    searchParams.set('behaviors', JSON.stringify(behaviors))
    setSearchParams(searchParams)
  }, [behaviors, mapping, searchParams])

  return (
    <div className="w-full h-full items-center justify-center p-[1rem]">
      <div className="flex flex-col gap-[0.5rem] h-full">
        <Slice9 className="h-[4rem]">
          <div className="flex justify-between items-center h-full">
            <Link
              to={`/create?${searchParams.toString()}`}
              className="-translate-y-[0.125rem]"
            >
              <Slice9 frameUrl="/button.png">
                <div className="flex gap-[0.125rem] px-[0.125rem]">
                  <Icon>{'<'}</Icon>
                  <SpriteText>PREV</SpriteText>
                </div>
              </Slice9>
            </Link>
            <SpriteText>PROGRAM</SpriteText>
            <Link
              to={`/create_name?${searchParams.toString()}`}
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

            <Slice9 className="flex-auto min-w-[24rem] relative">
              <Panel title="CPU">
                <div className="flex">
                  <div className="flex-1 flex flex-col gap-[0.25rem] pl-[0.5rem]">
                    {[...itemDetails['head_' + head].details.cpu, 'always'].map(
                      (name: string, i: number) => {
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              if (selected !== i) {
                                setSelected(i)
                              } else {
                                setSelected(null)
                              }
                            }}
                            className="cursor-pointer relative items-center flex w-full"
                          >
                            <CpuChip name={name} index={i} />
                            {selected === i && (
                              <div className="z-10 absolute -right-[2.5rem] flex -space-x-[0.25rem]">
                                <InsertAnim />
                              </div>
                            )}
                          </button>
                        )
                      }
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex-1 flex flex-col gap-[0.25rem] pr-[0.5rem]">
                      {[
                        ...Array(
                          itemDetails['head_' + head].details.cpu.length + 1
                        ).keys(),
                      ].map((i) => {
                        try {
                          if (mapping[i] !== undefined) {
                            const [name, cost] = actions[mapping[i]]
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  if (selected !== i) {
                                    setSelected(i)
                                  } else {
                                    setSelected(null)
                                  }
                                }}
                                className="cursor-pointer flex w-full"
                              >
                                <ActionChip
                                  name={name}
                                  cost={cost}
                                  inserted
                                  className={cn(selected === i && 'opacity-0')}
                                />
                              </button>
                            )
                          }
                        } catch (e) {}

                        return <div key={i} className="h-[2rem]" />
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      setMapping([])
                    }}
                  >
                    CLEAR
                  </Button>
                </div>
              </Panel>
              {selected !== null && (
                <div className="absolute right-[calc(50%-3rem)] top-[1rem]">
                  <Slice9 className="absolute w-[16rem] z-50 max-h-full">
                    <div className="flex flex-col gap-[0.25rem] p-[0.5rem]">
                      {actions.map(([action, cost]: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (selected === null) return
                            setMapping((prev) => {
                              prev[selected] = i
                              return [...prev]
                            })

                            setSelected(null)
                          }}
                          className="cursor-pointer"
                        >
                          <ActionChip name={action} cost={cost} />
                        </button>
                      ))}
                      <Button
                        onClick={() => {
                          if (selected === null) return
                          setMapping((prev) => {
                            prev[selected] = undefined
                            return [...prev]
                          })

                          setSelected(null)
                        }}
                        className="w-full"
                      >
                        UNSET
                      </Button>
                    </div>
                  </Slice9>
                </div>
              )}
            </Slice9>

            <div
              className="bg-black h-full aspect-[16/15] flex-none relative overflow-hidden"
              onClick={() => {
                setPause((p) => !p)
              }}
            >
              <GameEgine
                {...gameEngineProps}
                paused={pause}
                characters={[{ head, body, legs, weapon }]}
              />
            </div>
          </div>
        </div>
        <HelpPanel>
          Program your Robot Master{"'"}s behavior by selecting each chip and
          assigning it an action. Priority is always from top to bottom.
        </HelpPanel>
      </div>
    </div>
  )
}

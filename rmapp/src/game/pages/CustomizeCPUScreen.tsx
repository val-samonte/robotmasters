import { Link, useSearchParams } from 'react-router'
import { SpriteText } from '../components/SpriteText'
import { CharacterPanel } from '../components/CharacterPanel'
import { itemDetails } from '../itemList'
import { useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { useAtom, useSetAtom } from 'jotai'
import { paintAtom } from '../../atoms/paintAtom'
import { Slice9 } from '../components/Slice9'
import { Icon } from '../components/Icon'
import { helpTipAtom } from '../../atoms/helpTipAtom'
import { Panel } from '../components/Panel'
import { CpuChip } from '../components/CpuChip'
import { InsertAnim } from '../components/InsertAnim'
import { ActionChip } from '../components/ActionChip'
import { Button } from '../components/Button'

export function CustomizeCPUScreen() {
  const [searchParams] = useSearchParams()
  const [selected, setSelected] = useState<number | null>(null)
  const [mapping, setMapping] = useState<(number | undefined)[]>([])
  const setPaint = useSetAtom(paintAtom)
  const [helpTip] = useAtom(helpTipAtom)

  const head = searchParams.get('head') ?? '0'
  const body = searchParams.get('body') ?? '0'
  const legs = searchParams.get('legs') ?? '0'
  const weapon = searchParams.get('weapon') ?? 'hg_0'

  useEffect(() => {
    if (searchParams.has('paint')) {
      setPaint(searchParams.get('paint')!)
    }
  }, [searchParams])

  const actions = useMemo(() => {
    const head = searchParams.get('head') ?? '0'
    const body = searchParams.get('body') ?? '0'
    const legs = searchParams.get('legs') ?? '0'
    const weapon = searchParams.get('weapon') ?? 'hg_0'

    const actions: [string, number][] = [
      ...(itemDetails['head_' + head].details.actions ?? []),
      ...(itemDetails['body_' + body].details.actions ?? []),
      ...(itemDetails['legs_' + legs].details.actions ?? []),
      ...(itemDetails[weapon].details.actions ?? []),
    ]

    return actions
  }, [searchParams])

  return (
    <div className="w-full h-full items-center justify-center p-[1rem]">
      <div className="flex flex-col gap-[0.5rem] h-full">
        <Slice9 className="h-[4rem]">
          <div className="flex justify-between items-center">
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
              to={`/create_game_account?${searchParams.toString()}`}
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
                                key={`${name}_${i}`}
                                name={name}
                                cost={cost}
                                inserted
                                className={cn(selected === i && 'opacity-0')}
                              />
                            </button>
                          )
                        }

                        return <div className="h-[2rem]" />
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button onClick={() => setMapping([])}>CLEAR</Button>
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

            <div className="bg-black h-full aspect-[16/15] flex-none relative"></div>
          </div>
        </div>

        <Slice9>
          <div className="p-[0.5rem] flex flex-col gap-[0.5rem] landscape:h-[3.5rem] overflow-auto">
            {helpTip ? (
              <>
                {helpTip.title && (
                  <SpriteText color="#38B8F8">{helpTip.title}</SpriteText>
                )}
                <SpriteText>{helpTip.message}</SpriteText>
              </>
            ) : (
              <SpriteText>
                Program your Robot Master{"'"}s behavior by selecting each chip
                and assigning it an action. Priority is always from top to
                bottom.
              </SpriteText>
            )}
          </div>
        </Slice9>
      </div>
    </div>
  )
}

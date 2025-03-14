import { Link, useSearchParams } from 'react-router'
import { SpriteText } from '../components/SpriteText'
import { CharacterStats } from '../components/CharacterStats'
import { cpuDesc, itemDetails } from '../itemList'
import { useMemo, useState } from 'react'
import cn from 'classnames'
import { Main } from '../components/Main'

export function CustomizeCPUScreen() {
  const [searchParams] = useSearchParams()
  const [selected, setSelected] = useState<number | null>(null)
  const [mapping, setMapping] = useState<(string | undefined)[]>([])

  const head = searchParams.get('head') ?? '0'
  const body = searchParams.get('body') ?? '0'
  const legs = searchParams.get('legs') ?? '0'
  const weapon = searchParams.get('weapon') ?? 'hg_0'

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
        <div className="border-white border-[0.25em] bg-slate-800 p-[1rem] flex justify-center">
          <SpriteText>PROGRAM</SpriteText>
        </div>
        <div className="flex flex-auto gap-[0.5rem]">
          <div className="border-white border-[0.25em] bg-slate-800 py-[1rem] flex-none min-w-[465px]">
            <CharacterStats
              head={head}
              body={body}
              legs={legs}
              weapon={weapon}
            />
          </div>
          <div className="border-white border-[0.25em] bg-slate-800 flex-auto flex flex-col">
            <div className="flex flex-auto">
              <div className="pt-[1rem] gap-[1rem] h-full flex flex-2 flex-col border-r-[0.125em] border-slate-700">
                <div className="px-[1rem] opacity-50">
                  <SpriteText>
                    {itemDetails['head_' + head].name} CPU
                  </SpriteText>
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                  {[...itemDetails['head_' + head].details.cpu, 'always'].map(
                    (name: string, i: number) => {
                      return (
                        <div key={`cpu_${i}`} className="px-[1rem] flex w-full">
                          <button
                            onClick={() => setSelected(i)}
                            className={cn(
                              selected === i
                                ? 'border-blue-400'
                                : 'border-transparent',
                              'flex gap-[1rem] border-[0.125rem] w-full cursor-pointer'
                            )}
                          >
                            <div
                              className={cn(
                                'flex w-full ',
                                mapping[i] ? 'bg-blue-800' : 'bg-black'
                              )}
                            >
                              <div className="bg-amber-500 p-[0.25rem] pr-[0.5rem] flex-1">
                                <SpriteText>{name.toUpperCase()}</SpriteText>
                              </div>
                              <div className="p-[0.25rem] flex-1 relative flex items-center justify-end">
                                <div
                                  className={cn(
                                    'w-[1rem] h-[1rem] -left-[0.5rem] absolute',
                                    mapping[i] ? 'bg-blue-800' : 'bg-black'
                                  )}
                                />
                                {mapping[i] && (
                                  <SpriteText>
                                    {mapping[i].toUpperCase()}
                                  </SpriteText>
                                )}
                              </div>
                            </div>
                          </button>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
              <div className="pt-[1rem] gap-[1rem] h-full flex flex-1 flex-col">
                <div className="px-[1rem] opacity-50">
                  <SpriteText>ACTIONS</SpriteText>
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                  {actions.map(([action]: any) => {
                    return (
                      <button
                        onClick={() => {
                          if (selected === null) return
                          setMapping((prev) => {
                            prev[selected] = action
                            return [...prev]
                          })
                          setSelected(null)
                        }}
                        key={action}
                        className="flex items-center justify-between px-[1rem] cursor-pointer"
                      >
                        <div className="p-[0.25rem] bg-slate-700">
                          <SpriteText>{action.toUpperCase()}</SpriteText>
                        </div>
                        {/* <div className="flex gap-[0.25rem]">
                          <img
                            src={`/energy.png`}
                            alt={`energy`}
                            className="w-[1rem] h-[1rem]"
                          />
                          <SpriteText>{cost}</SpriteText>
                        </div> */}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => {
                      if (selected === null) return
                      setMapping((prev) => {
                        prev[selected] = undefined
                        return [...prev]
                      })
                      setSelected(null)
                    }}
                    className="flex items-center justify-between px-[1rem] cursor-pointer"
                  >
                    <div className="p-[0.25rem] bg-black">
                      <SpriteText>EMPTY</SpriteText>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-[1rem] border-white border-t-[0.125em] flex justify-center gap-[2rem]">
              <Link to={`/create?${searchParams.toString()}`}>
                <SpriteText>PREV</SpriteText>
              </Link>
              <Link to={`/create_game_account?${searchParams.toString()}`}>
                <SpriteText>NEXT</SpriteText>
              </Link>
            </div>
          </div>
          <div className="bg-black h-full aspect-[16/15] flex-none">
            <Main />
          </div>
        </div>
        <div className="border-white border-[0.25em] bg-slate-800 p-[1rem] flex flex-col gap-[0.5rem] min-h-[120px]">
          {selected !== null ? (
            <>
              <SpriteText>
                {
                  cpuDesc[
                    [...itemDetails['head_' + head].details.cpu, 'always'][
                      selected
                    ]
                  ]
                }
                , do{' '}
                {mapping[selected] ? mapping[selected].toUpperCase() : '...'}
              </SpriteText>
            </>
          ) : (
            <>
              <SpriteText>
                Program your Robot Master by selecting each behavior and assign
                them with actions. Priority is always top to bottom.
              </SpriteText>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

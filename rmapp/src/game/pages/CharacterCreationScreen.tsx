import cn from 'classnames'
import { CharacterPreview } from '../components/CharacterPreview'
import { SpriteText } from '../components/SpriteText'
import { useMemo, useState } from 'react'
import { itemDetails } from '../itemList'

const weapons = ['hg_0', 'hg_1', 'hg_2', 'gl_0', 'gl_1', 'gl_2']

export function CharacterCreationScreen() {
  const [head, setHead] = useState('0')
  const [body, setBody] = useState('0')
  const [legs, setLegs] = useState('0')
  const [weapon, setWeapon] = useState('hg_0')
  const [lastSelected, setLastSelected] = useState('')

  const overallStats = useMemo(() => {
    let generator =
      itemDetails['body_' + body].details?.stats?.find(
        ([key]: any) => key === 'GEN'
      )[1] ?? '1.1'
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
    <div className="w-full h-full items-center justify-center p-[1rem]">
      <div className="flex flex-col gap-[0.5rem] h-full">
        <div className="border-white border-[0.25em] bg-slate-800 p-[1rem] flex justify-center">
          <SpriteText>CREATE ROBOT MASTER</SpriteText>
        </div>
        <div className="flex flex-auto gap-[0.5rem]">
          <div className="border-white border-[0.25em] bg-slate-800 py-[1rem] flex-1">
            <div className="flex flex-col flex-auto gap-[1rem]">
              <div className="flex items-center justify-center scale-200 p-[2em]">
                <CharacterPreview
                  head={head}
                  body={body}
                  legs={legs}
                  weapon={weapon}
                />
              </div>

              <div className="w-full border-slate-700 border-b-[0.125em]" />
              <div className="flex flex-col px-[1rem] gap-[1rem]">
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
                <div className="px-[1rem]">
                  <SpriteText>ARMOR</SpriteText>
                </div>
                <div className="flex flex-wrap px-[1rem] gap-[1rem]">
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
              {overallStats.overweight < 1 && (
                <div className="flex px-[1rem] justify-between opacity-50">
                  <SpriteText>OVERWEIGHT</SpriteText>
                </div>
              )}
            </div>
          </div>
          <div className="border-white border-[0.25em] bg-slate-800 pt-[1rem] flex-2 flex flex-col">
            <div className="flex flex-col flex-auto gap-[1rem]">
              <div className="flex items-center justify-between px-[1rem]">
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
              <div className="w-full border-slate-700 border-b-[0.125em]" />
              <div className="flex items-center justify-between px-[1rem]">
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
              <div className="w-full border-slate-700 border-b-[0.125em]" />
              <div className="flex items-center justify-between px-[1rem]">
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
              <div className="w-full border-slate-700 border-b-[0.125em]" />
              <div className="flex flex-col px-[1rem] gap-[1rem]">
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
            <div className="p-[1rem] border-white border-t-[0.125em] flex justify-center">
              <SpriteText>NEXT</SpriteText>
            </div>
          </div>
          <div className="border-white border-[0.25em] bg-slate-800 py-[1rem] flex-1">
            {itemDetails[lastSelected]?.details && (
              <div className="flex flex-col gap-[1rem]">
                <div className="flex px-[1rem] justify-between items-center">
                  {itemDetails[lastSelected]?.name && (
                    <SpriteText>{itemDetails[lastSelected].name}</SpriteText>
                  )}
                </div>

                {itemDetails[lastSelected].details?.stats && (
                  <>
                    <div className="w-full border-slate-700 border-b-[0.125em]" />
                    <div className="flex flex-col px-[1rem] gap-[1rem]">
                      {itemDetails[lastSelected].details.stats.map(
                        ([key, val]: any) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <SpriteText>{key}</SpriteText>
                            <div className="flex gap-[0.25rem]">
                              {key === 'ELEM' && (
                                <img
                                  src={`/elem_${val}.png`}
                                  alt={`elem_${val}`}
                                  className="w-[1rem] h-[1rem]"
                                />
                              )}
                              <SpriteText>
                                {(val + '').toUpperCase()}
                              </SpriteText>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}
                {itemDetails[lastSelected].details?.protection && (
                  <>
                    <div className="w-full border-slate-700 border-b-[0.125em]" />
                    <div className="flex justify-between items-center">
                      <div className="opacity-50 px-[1rem]">
                        <SpriteText>ARMOR</SpriteText>
                      </div>
                      <div className="flex flex-wrap px-[1rem] gap-[1rem]">
                        {itemDetails[lastSelected].details.protection.map(
                          ([elem, pts]: any, i: number) => (
                            <div
                              key={`${elem}_${i}`}
                              className="flex items-center gap-[0.25rem]"
                            >
                              <img
                                src={`/elem_${elem}.png`}
                                alt={`elem_${elem}`}
                                className="w-[1rem] h-[1rem]"
                              />
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
                    <div className="w-full border-slate-700 border-b-[0.125em]" />
                    <div className="opacity-50 px-[1rem]">
                      <SpriteText>ACTIONS</SpriteText>
                    </div>
                    <div className="flex flex-col px-[1rem] gap-[1rem]">
                      {itemDetails[lastSelected].details.actions.map(
                        ([action, cost]: any) => (
                          <div
                            key={action}
                            className="flex items-center justify-between"
                          >
                            <SpriteText>{action.toUpperCase()}</SpriteText>
                            <div className="flex gap-[0.25rem]">
                              <img
                                src={`/energy.png`}
                                alt={`energy`}
                                className="w-[1rem] h-[1rem]"
                              />
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
                    <div className="w-full border-slate-700 border-b-[0.125em]" />
                    <div className="opacity-50 px-[1rem]">
                      <SpriteText>CPU</SpriteText>
                    </div>
                    <div className="flex flex-col px-[1rem] gap-[1rem]">
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
        </div>
        <div className="border-white border-[0.25em] bg-slate-800 p-[1rem] flex flex-col gap-[0.5rem]">
          {itemDetails[lastSelected]?.name && (
            <SpriteText>{itemDetails[lastSelected].name}</SpriteText>
          )}
          {itemDetails[lastSelected]?.desc && (
            <SpriteText>{itemDetails[lastSelected].desc}</SpriteText>
          )}
        </div>
      </div>
    </div>
  )
}

import { Link, useSearchParams } from 'react-router'
import { Slice9 } from '../components/Slice9'
import { Icon } from '../components/Icon'
import { SpriteText } from '../components/SpriteText'
import { CharacterPanel } from '../components/CharacterPanel'
import { useEffect, useState } from 'react'
import { paintAtom } from '../../atoms/paintAtom'
import { useSetAtom } from 'jotai'
import { HelpPanel } from '../components/HelpPanel'
import { keyboard } from '../constants'

export function CharacterNamingScreen() {
  const [searchParams] = useSearchParams()
  const setPaint = useSetAtom(paintAtom)

  useEffect(() => {
    if (searchParams.has('paint')) {
      setPaint(searchParams.get('paint')!)
    }
  }, [searchParams])

  const head = searchParams.get('head') ?? '0'
  const body = searchParams.get('body') ?? '0'
  const legs = searchParams.get('legs') ?? '0'
  const weapon = searchParams.get('weapon') ?? 'hg_0'
  const [name, setName] = useState('')

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault()

        setName((p) => {
          if (p.length > 0) {
            return p.substring(0, p.length - 1)
          }
          return p
        })
      } else {
        const c = e.key.replace(/[^0-9A-Za-z]/gi, '')
        setName((p) => {
          if (p.length < 6 && e.key.length === 1) {
            return p + c
          }
          return p
        })
      }
    }
    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [])

  return (
    <div className="w-full h-full items-center justify-center p-[1rem]">
      <div className="flex flex-col gap-[0.5rem] h-full">
        <Slice9 className="h-[4rem]">
          <div className="flex justify-between items-center">
            <Link
              to={`/custom_cpu?${searchParams.toString()}`}
              className="-translate-y-[0.125rem]"
            >
              <Slice9 frameUrl="/button.png">
                <div className="flex gap-[0.125rem] px-[0.125rem]">
                  <Icon>{'<'}</Icon>
                  <SpriteText>PREV</SpriteText>
                </div>
              </Slice9>
            </Link>
            <SpriteText>ROBOT MASTER NAME</SpriteText>
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

            <div className="flex flex-col flex-auto gap-[0.125rem]">
              <Slice9 frameUrl="/plate.png">
                <div className="p-[0.5rem] flex justify-center">
                  <SpriteText>{name}</SpriteText>
                  {name.length < 6 && (
                    <SpriteText className="animate-[blink_500ms_infinite_steps(1)]">
                      _
                    </SpriteText>
                  )}
                </div>
              </Slice9>
              <Slice9 frameUrl="/plate.png" className="flex-auto">
                <div className="flex items-center justify-center h-full">
                  <div className="grid grid-cols-10 grid-rows-6 gap-[1rem]">
                    {keyboard.map((key, i) => (
                      <button
                        key={i}
                        className="cursor-pointer"
                        onClick={() => {
                          if (name.length < 6) setName((p) => p + key)
                        }}
                      >
                        <SpriteText>{key}</SpriteText>
                      </button>
                    ))}
                    <div className="col-span-8 flex items-center justify-end">
                      <button
                        className="flex items-center cursor-pointer"
                        onClick={() => {
                          if (name.length > 0)
                            setName((p) => p.substring(0, p.length - 1))
                        }}
                      >
                        <Icon>{'<'}</Icon>
                        <SpriteText>DEL</SpriteText>
                      </button>
                    </div>
                  </div>
                </div>
              </Slice9>
            </div>
          </div>
        </div>

        <HelpPanel>
          Name your ROBOT MASTER. Min 3 characters. Max 6 characters.
        </HelpPanel>
      </div>
    </div>
  )
}

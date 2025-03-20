import { Application, useExtend } from '@pixi/react'
import { Container, Graphics, Sprite } from 'pixi.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GameObjectView } from './GameObjectView'
import { GameState } from '../types/GameState'
import init, { RmGameEngine } from '../../wasm/wasm_bindgen_wrapper'
import { maps } from '../constants'
import { CharacterRender } from './CharacterRender'
import { MapRender } from './MapRender'
import { ViewWrapper } from './ViewWrapper'

const desiredFPS = 60
const frameInterval = 1000 / desiredFPS

export interface GameObject {
  id: string
  group: number
  x: number
  y: number
  facing_right: boolean
  width: number
  height: number
  behaviors: number[][]
  jump_force: number
  move_speed: number
  weapons: number[][]
  protections: number[]
}

export interface GameEngineProps {
  paused?: boolean
  mapId: string
  seed: number
  demo: boolean
  objects: GameObject[]
  gravity: number
  characters: {
    head: string
    body: string
    legs: string
    weapon: string
  }[]
}

export function GameEgine({
  paused,
  mapId,
  seed,
  demo,
  objects,
  gravity,
  characters,
}: GameEngineProps) {
  useExtend({
    Sprite,
    Container,
    Graphics,
  })

  const lastFrameTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number>(0)

  const game = useRef<RmGameEngine>()
  const initialized = useRef(false)
  const [gameState, setGameState] = useState<GameState>()
  const [ready, setReady] = useState(false)

  const map = useMemo(() => {
    return maps.find((m) => m.id === mapId) ?? maps[0]
  }, [mapId])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    init()
      .then(() => setReady(true))
      .catch(console.error)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (game.current) {
        game.current.free()
      }
    }
  }, [])

  const gameLoop = (currentTime: number) => {
    if (paused) return
    if (!game.current) return

    const delta = currentTime - lastFrameTimeRef.current

    if (delta >= frameInterval) {
      lastFrameTimeRef.current = currentTime - (delta % frameInterval)

      const snapshot = game.current.next_frame() as GameState
      setGameState(snapshot)
    }
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }

  useEffect(() => {
    if (ready) {
      if (game.current) {
        game.current.free()
      }

      const map = maps.find((m) => m.id === mapId) ?? maps[0]
      const initialObjects = objects.map((o, i) => {
        return {
          ...o,
          x: map.spawnPositions[i].x,
          y: map.spawnPositions[i].y,
          facing_right: map.spawnPositions[i].facing_right,
        }
      })
      game.current = new RmGameEngine(
        333,
        demo,
        initialObjects,
        map.tiles,
        gravity
      )

      gameLoop(0)
    }
  }, [ready, mapId, seed, demo, objects, gravity])

  if (!gameState) return null

  return (
    <ViewWrapper>
      <Application
        width={256}
        height={240}
        antialias={false}
        resolution={1}
        backgroundColor={0x000000}
      >
        <MapRender skin={map.skin} />
        {(gameState?.entities ?? []).map((obj) => {
          if (!obj.projectile_id) {
            return (
              <CharacterRender
                key={obj.entity}
                {...obj}
                {...characters[0]}
                frame={gameState.frame}
              />
            )
          }
          return (
            <GameObjectView
              key={obj.entity}
              x={obj.x}
              y={obj.y}
              width={obj.width}
              height={obj.height}
            />
          )
        })}
      </Application>
    </ViewWrapper>
  )
}

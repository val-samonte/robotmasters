import { Application, useExtend } from '@pixi/react'
import { Container, Graphics, Sprite } from 'pixi.js'
import { StageScaler } from '../../wrapper/components/StageScaler'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GameObjectView } from './GameObject'
import { GameState } from '../types/GameState'
import init, { RmGameEngine } from '../../wasm/wasm_bindgen_wrapper'
import { maps } from '../constants'

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
}

export function GameEgine({
  paused,
  mapId,
  seed,
  demo,
  objects,
  gravity,
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
      console.log('Instance', mapId, seed, demo, objects, gravity)
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
        true,
        initialObjects,
        map.tiles,
        gravity
      )

      gameLoop(0)
    }
  }, [ready, mapId, seed, demo, objects, gravity])

  if (!gameState) return null

  return (
    <StageScaler>
      <Application
        width={256}
        height={240}
        antialias={false}
        resolution={1}
        backgroundColor={0x000000}
      >
        {map.tiles.map((row, i) =>
          row.map((tile, j) => {
            if (tile === 0) return null
            return (
              <GameObjectView
                key={`${i}-${j}`}
                x={j * 16}
                y={i * 16}
                width={16}
                height={16}
                color={'gray'}
              />
            )
          })
        )}
        {(gameState?.entities ?? []).map((obj) => {
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
    </StageScaler>
  )
}

import { Application, useExtend } from '@pixi/react'
import { Container, Graphics, Sprite } from 'pixi.js'
import { StageScaler } from '../../wrapper/components/StageScaler'
import { useEffect, useRef, useState } from 'react'
import { GameObjectView } from './GameObject'
import { GameState } from '../types/GameState'
import init, { RmGameEngine } from '../../wasm/wasm_bindgen_wrapper'
import { SpriteText } from './SpriteText'
import { Slice9 } from './Slice9'

const tiles = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

const initialObjects = [
  {
    id: 'bulletman1',
    group: 0,
    x: 16,
    y: 192,
    width: 16,
    height: 32,
    behaviors: [
      [4, 5, 0],
      // [9, 4, 20],
      [2, 3, 6],
      [8, 2, 3],
      [7, 8, 0],
      [8, 7, 0],
      [1, 1, 1],
      [10, 0, 0],
    ],
    weapons: [
      [
        1, // firearm
        1, // projectile lookup index
        1, // projectile ejection method (single, tri45, tri90, shotgun90, up, down) todo: replace with ejection "script"
        2, // attack energy cost
        5, // reload energy cost
        120, // reload cooldown
        5, // ammo cap
        15, // rate of fire
        0, //   outputPosX = 0,
        12, //   outputPosY = 12,
        1, //   outputCount = 1, // note: loop, attackCounter still counts individually
        0, //   recoil = 0,
        0, //   requireGrounded,
      ],
      // [
      //   1,   // firearm
      //   2,   // projectile lookup index
      //   1,   // projectile ejection method
      //   2,   // attack energy cost
      //   10,  // reload energy cost
      //   120, // reload cooldown
      //   1,   // ammo cap
      //   0    // rate of fire
      // ],
      // [
      //   1,   // firearm
      //   3,   // projectile lookup index
      //   1,   // projectile ejection method
      //   2,   // attack energy cost
      //   6,   // reload energy cost
      //   240, // reload cooldown
      //   6,   // ammo cap
      //   50   // rate of fire
      // ],

      // todo:
      // crawler
      // homing
    ],
    protections: [
      0, // Punct
      0, // Blast
      0, // Force
      0, // Sever
      0, // Heat
      0, // Cryo
      0, // Jolt
      0, // Virus
    ],
  },
  {
    id: 'bulletman2',
    group: 1,
    x: 32,
    y: 192,
    width: 16,
    height: 32,
    behaviors: [
      [4, 5, 0],
      // [9, 4, 20],
      [2, 3, 6],
      [8, 2, 3],
      [7, 8, 0],
      [8, 7, 0],
      [1, 1, 1],
      [10, 0, 0],
    ],
    weapons: [
      [
        1, // firearm
        1, // projectile lookup index
        1, // projectile ejection method (single, tri45, tri90, shotgun90, up, down) todo: replace with ejection "script"
        2, // attack energy cost
        5, // reload energy cost
        120, // reload cooldown
        5, // ammo cap
        15, // rate of fire
        0, //   outputPosX = 0,
        12, //   outputPosY = 12,
        1, //   outputCount = 1, // note: loop, attackCounter still counts individually
        0, //   recoil = 0,
        0, //   requireGrounded,
      ],
    ],
    protections: [
      0, // Punct
      0, // Blast
      0, // Force
      0, // Sever
      0, // Heat
      0, // Cryo
      0, // Jolt
      0, // Virus
    ],
  },
]

// const projectileDefinitions = []

const colors = ['pink', 'orange']

export function Main() {
  useExtend({
    Sprite,
    Container,
    Graphics,
  })

  const lastFrameTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number>(0)

  const desiredFPS = 60
  const frameInterval = 1000 / desiredFPS

  const game = useRef<RmGameEngine>()
  const initialized = useRef(false)
  const [gameState, setGameState] = useState<GameState>()

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    init()
      .then(() => {
        game.current = new RmGameEngine(334, initialObjects, tiles, 0.5)
        const snapshot = game.current.next_frame() as GameState
        setGameState(snapshot)
      })
      .catch(console.error)
  }, [setGameState])

  const gameLoop = (currentTime: number) => {
    if (!game.current) return
    if (!gameState) return
    const delta = currentTime - lastFrameTimeRef.current

    if (delta >= frameInterval) {
      lastFrameTimeRef.current = currentTime - (delta % frameInterval)

      const snapshot = game.current.next_frame() as GameState
      setGameState(snapshot)
    }
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }

  useEffect(() => {
    if (gameState?.frame !== 1) return
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gameState])

  return (
    <div className="fixed inset-0 w-full h-full bg-stone-900">
      <div className="absolute top-0 left-0 p-4 text-white z-40 text-xs">
        <Slice9 className="m-2">
          <div className="p-2">
            <SpriteText>{'ROBOT MASTERS\nv0.0.1'}</SpriteText>
          </div>
        </Slice9>
        {gameState && (
          <div className="flex flex-col gap-1">
            <div>{Math.floor(gameState.frame / 60)}</div>
            {(gameState.entities ?? []).map((obj) => (
              <div key={obj.entity} className="flex gap-2">
                <span>{obj.entity}</span>
                {typeof obj.health === 'number' && <span>❤️{obj.health}</span>}
                {typeof obj.energy === 'number' && <span>⚡{obj.energy}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
      <StageScaler>
        <Application
          width={256}
          height={240}
          antialias={false}
          resolution={1}
          backgroundColor={0x000000}
        >
          {tiles.map((row, i) =>
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
                color={colors[obj.entity]}
              />
            )
          })}
        </Application>
      </StageScaler>
      {(gameState?.state === 2 || gameState?.state === 3) && (
        <div className="text-sm text-white font-bold font-mono fixed inset-0 flex items-center justify-center z-50">
          Game Over
        </div>
      )}
    </div>
  )
}

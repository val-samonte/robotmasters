import { Entity } from './Entity'

export interface GameState {
  state: number
  frame: number
  gravity: number
  entities: Entity[]
}

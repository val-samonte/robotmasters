export interface BaseEntity {
  entity: number
  x: number
  y: number
  vel_x: number
  vel_y: number
  width: number
  height: number
  dir_x?: number
  dir_y?: number
  c_top?: boolean
  c_right?: boolean
  c_left?: boolean
  c_bottom?: boolean
}

export interface ProjectileEntity extends BaseEntity {
  projectile_id: number
}

export interface CharacterEntity extends BaseEntity {
  energy: number
  health: number
  last_action: number
  last_action_frame: number
  ammo_count: number
  ammo_cap: number
}

export type Entity = ProjectileEntity & CharacterEntity

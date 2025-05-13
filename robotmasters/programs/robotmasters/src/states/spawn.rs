use bolt_lang::prelude::*;

use super::{ComponentState, Element};

#[account]
pub struct Spawn {
    pub bump: u8,
    pub id: u32,
    pub version: u32,
    pub state: ComponentState,

    pub health_cap: u8,
    pub duration: u16,
    pub damage_base: u8,
    pub damage_range: u8,
    pub crit_chance: u8,
    pub crit_multiplier: u8,
    pub element: Element,
    pub destroy_on_collision: bool,
    pub width: u8,
    pub height: u8,
    pub output_x: u8,
    pub output_y: u8,

    pub args: [u8; 4],
    pub script: Vec<u8>,
}

impl Spawn {
    pub fn len(script_len: usize) -> usize {
        8 +  // account discriminator
		1 +  // bump
		1 +  // state
		4 +  // id
		4 +  // version
        1 +  // health_cap
        2 +  // duration
        1 +  // damage_base
        1 +  // damage_range
        1 +  // crit_chance
        1 +  // crit_multiplier
        1 +  // element
        1 +  // destroy_on_collision
        1 +  // width
        1 +  // height
        1 +  // output_x
        1 +  // output_y
		4 +  // args
		4 +  // Vec length prefix (u32)
		script_len // actual script data
    }
}

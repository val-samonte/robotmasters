use bolt_lang::prelude::*;

use super::ComponentState;

#[account]
pub struct Action {
    pub bump: u8,
    pub id: u32,
    pub version: u32,
    pub state: ComponentState,
    pub energy_cost: u8,
    pub interval: u16,
    pub duration: u16,
    pub args: [u8; 4],
    pub script: Vec<u8>,
}

impl Action {
    pub fn len(script_len: usize) -> usize {
        8 +  // account discriminator
		1 +  // bump
		1 +  // state
		4 +  // id
		4 +  // version
		1 +  // energy_cost
		2 +  // interval
        2 +  // duration
		4 +  // args
		4 +  // Vec length prefix (u32)
		script_len // actual script data
    }
}

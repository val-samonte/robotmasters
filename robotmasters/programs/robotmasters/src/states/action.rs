use bolt_lang::prelude::*;

use super::{ComponentState, FromAccountInfo};

#[account]
pub struct Action {
    pub bump: u8,
    pub id: u32,
    pub version: u32,
    pub state: ComponentState,
    pub energy_cost: u8,
    pub interval: u16,
    pub duration: u16,
    pub args: [Option<u8>; 4],
    pub script: Vec<u8>,
    pub spawns: Vec<u32>,
}

impl Action {
    pub fn len(script_len: usize, spawns_len: usize) -> usize {
        8 +  // account discriminator
		1 +  // bump
		1 +  // state
		4 +  // id
		4 +  // version
		1 +  // energy_cost
		2 +  // interval
        2 +  // duration
		4 * (1 + 1) +  // args
		(4 + script_len) +
		(4 + (4 * spawns_len))
    }

    pub fn serialize(&self, args: [Option<u8>; 4]) -> Vec<u16> {
        let output_len = 3 + 4 + self.script.len();
        let mut output = Vec::with_capacity(output_len);

        output.push(self.energy_cost as u16);
        output.push(self.interval);
        output.push(self.duration);
        output.extend(args.iter().map(|opt| opt.unwrap_or(0) as u16));
        output.extend(self.script.iter().map(|&x| x as u16));

        output
    }
}

impl FromAccountInfo for Action {}

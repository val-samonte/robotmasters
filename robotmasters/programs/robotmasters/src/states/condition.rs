use bolt_lang::prelude::*;

use super::{ComponentState, FromAccountInfo};

#[account]
pub struct Condition {
    pub bump: u8,
    pub id: u32,
    pub version: u32,
    pub state: ComponentState,
    pub energy_mul_num: u8,
    pub energy_mul_den: u8,
    pub args: [u8; 4],
    pub script: Vec<u8>,
}

impl Condition {
    pub fn len(script_len: usize) -> usize {
        8 +  // account discriminator
		1 +  // bump
		1 +  // state
		4 +  // id
		4 +  // version
		1 +  // energy_mul_num
		1 +  // energy_mul_den
		4 +  // args
		4 +  // Vec length prefix (u32)
		script_len // actual script data
    }

    pub fn serialize(&self) -> Vec<u16> {
        let output_len = 2 + 4 + self.script.len();
        let mut output = Vec::with_capacity(output_len);

        output.push(self.energy_mul_num as u16);
        output.push(self.energy_mul_den as u16);
        output.extend(self.args.iter().map(|&x| x as u16));
        output.extend(self.script.iter().map(|&x| x as u16));

        output
    }
}

impl FromAccountInfo for Condition {}

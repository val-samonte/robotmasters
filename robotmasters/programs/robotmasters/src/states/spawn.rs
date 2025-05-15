use bolt_lang::prelude::*;

use super::{ComponentState, Element, FromAccountInfo};

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
    pub args: [Option<u8>; 4],
    pub script: Vec<u8>,
    pub spawns: Vec<u32>,
}

impl Spawn {
    pub fn len(script_len: usize, spawns_len: usize) -> usize {
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
		4 * (1 + 1) +  // args
		(4 + script_len) +
		(4 + (4 * spawns_len))
    }

    pub fn serialize(&self, args: [Option<u8>; 4]) -> Vec<u16> {
        let output_len = 12 + 4 + self.script.len();
        let mut output = Vec::with_capacity(output_len);

        output.push(self.health_cap as u16);
        output.push(self.duration);
        output.push(self.damage_base as u16);
        output.push(self.damage_range as u16);
        output.push(self.crit_chance as u16);
        output.push(self.crit_multiplier as u16);
        output.push(self.element.to_byte() as u16);
        output.push((if self.destroy_on_collision { 1 } else { 0 }) as u16);
        output.push(self.width as u16);
        output.push(self.height as u16);
        output.push(self.output_x as u16);
        output.push(self.output_y as u16);
        output.extend(args.iter().map(|opt| opt.unwrap_or(0) as u16));
        output.extend(self.script.iter().map(|&x| x as u16));

        output
    }
}

impl FromAccountInfo for Spawn {}

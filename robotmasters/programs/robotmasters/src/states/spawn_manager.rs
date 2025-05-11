use bolt_lang::prelude::*;
#[account]
pub struct SpawnManager {
    pub bump: u8,
    pub counter: u32,
}

impl SpawnManager {
    pub fn len() -> usize {
        8 +  // account discriminator
        1 +  // bump
		4 // counter
    }
}

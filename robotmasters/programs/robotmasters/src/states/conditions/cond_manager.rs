use bolt_lang::prelude::*;
#[account]
pub struct ConditionManager {
    pub bump: u8,
    pub counter: u32,
}

impl ConditionManager {
    pub fn len() -> usize {
        8 +  // account discriminator
        1 +  // bump
		4 // counter
    }
}

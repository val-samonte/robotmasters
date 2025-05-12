use bolt_lang::prelude::*;

#[account]
pub struct ConditionControl {
    pub bump: u8,
    pub id: u32,
    pub active: u32,
    pub counter: u32,
    pub owner: Pubkey,
}

impl ConditionControl {
    pub fn len() -> usize {
        8 +  // account discriminator
		1 +  // bump
		4 +  // id
		4 +  // counter
		4 +  // active
		32 // owner
    }
}

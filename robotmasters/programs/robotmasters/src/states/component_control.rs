use bolt_lang::prelude::*;

#[account]
pub struct ComponentControl {
    pub bump: u8,
    pub id: u32,
    pub active: u32,
    pub counter: u32,
    pub owner: Pubkey,
}

impl ComponentControl {
    pub fn len() -> usize {
        8 +  // account discriminator
		1 +  // bump
		4 +  // id
		4 +  // counter
		4 +  // active
		32 // owner
    }
}

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum ComponentState {
    Draft,
    Pending,
    Rejected,
    Approved,
    Published,
    Deprecated,
}

use bolt_lang::prelude::*;

#[account]
pub struct Admin {
    pub bump: u8,
    pub item_authority: Pubkey,
    pub treasury: Pubkey,
}

impl Admin {
    pub fn len() -> usize {
        8 +  // account discriminator
        1 +  // bump
		32 + // item_authority
        32 // treasury
    }
}

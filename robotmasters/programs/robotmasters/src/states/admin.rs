use bolt_lang::prelude::*;

#[account]
pub struct Admin {
    pub bump: u8,
    pub item_authority: Pubkey,
    pub treasury: Pubkey,

    /// For free trial version
    pub centralized_validator: Pubkey,
}

impl Admin {
    pub fn len() -> usize {
        8 +  // account discriminator
        1 +  // bump
		32 + // item_authority
        32 // treasury
    }
}

use bolt_lang::prelude::*;

// links the item id (generate by the component manager) and the blueprint address
// blueprint address as seed ensures no duplicates

#[account]
pub struct ItemBlueprintLink {
    pub bump: u8,
    pub id: u32,
    pub blueprint: Pubkey,
}

impl ItemBlueprintLink {
    pub fn len() -> usize {
        8 +  // discriminator
        1 +  // bump
        4 +  // id
        32 // blueprint
    }
}

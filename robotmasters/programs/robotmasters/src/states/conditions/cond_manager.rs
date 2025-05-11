use bolt_lang::*;

#[account]
pub struct ConditionControl {
    pub bump: u8,
    pub counter: u32,
}

impl ConditionControl {
    pub fn len() -> usize {
        8 +  // account discriminator
        1 +  // bump
		4 // counter
    }
}

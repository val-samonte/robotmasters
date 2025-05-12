use bolt_lang::prelude::*;

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize)]
pub enum ConditionState {
    Draft,
    Pending,
    Rejected,
    Approved,
    Published,
    Deprecated,
}

#[account]
pub struct Condition {
    pub bump: u8,
    pub id: u32,
    pub version: u32,
    pub state: ConditionState,
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
}

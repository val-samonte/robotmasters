use anchor_lang::prelude::*;

#[account]
pub struct GameState {
    pub bump: u8,

    pub authority: Pubkey,

    pub len: u16,

    pub frame: u16,

    // more fields to save:
    // initial game state hash
    // - in wasm, export game state, sha256
    // ending game state hash
    pub data: Box<[u8; 3600]>,
}

impl GameState {
    pub fn len() -> usize {
        8 + 1 + 32 + 2 + 2 + 3600
    }
}

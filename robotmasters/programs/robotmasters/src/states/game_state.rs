use bolt_lang::*;

use super::FromAccountInfo;

#[account]
pub struct GameState {
    pub bump: u8,
    pub id: Pubkey,
    pub raider: Pubkey,
    pub defender: Pubkey,
    pub state: GameStateState,
    pub raider_elo: u16,
    pub defender_elo: u16,
    // raider_win, raider_draw, raider_loss
    // -defender_loss, -defender_draw, -defender_win
    pub elo_changes: [i8; 3],
    pub len: u16,
    pub frame: u16,
    pub data: Box<Vec<u8>>,
}

impl GameState {
    pub fn len() -> usize {
        8 +  // discriminator
        1 +  // bump
        32 + // id
        32 + // raider
        32 + // defender
        1 +  // state
        2 +  // raider_elo
        2 +  // defender_elo
        3 +  // elo changes
        2 +  // len
        2 +  // drame
        3200 // data
    }
}

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum GameStateState {
    Pending,
    Concluded,
}

impl FromAccountInfo for GameState {}

use bolt_lang::prelude::*;

#[account]
pub struct CharacterMatch {
    pub bump: u8,
    pub state: CharacterMatchState,
    pub character: Pubkey,
    pub elo: u16,
    pub elo_seg: u8, // if elo is 1230, seg is 12
    pub elo_sub: u8, // if elo is 1230, sub is 1 (0: 0-24, 1: 25-49, 2: 50-74, 3: 75-99)

    /// Characters can have multiple async matches.
    /// As long as the character is treated as defender
    pub active_matches: u8,
}

impl CharacterMatch {
    pub fn len() -> usize {
        8 +  // discriminator
        1 +  // bump
        1 +  // state
        32 + // character
        2 +  // elo
        1 +  // elo segment
        1 +  // elo sub segment
        1 // active_matches
    }
}

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum CharacterMatchState {
    Rest,
    Deployed,
    /// When you are the challenger.
    /// You have to end your raid as a Raider before finding another match.
    Raider,
    /// When you are the challenged.
    /// You can still find a match if you are Defender.
    /// After the match has been made by you, you will be switched to Raider.
    Defender,
}

use bolt_lang::prelude::*;

/// Used to get realtime list of opponents onchain.
/// Updated when players deployed their characters (+1) / matched (-1).
#[account]
pub struct MatchCounter {
    pub bump: u8,
    /// Elo rating band, 1200 for instance, will update index position 12's counter.
    /// Wraps around if exceeds 255.
    pub band: [u8; 64], // could be more, but it doesn't matter for now
}

impl MatchCounter {
    pub fn len() -> usize {
        8 + 1 + 64
    }
}

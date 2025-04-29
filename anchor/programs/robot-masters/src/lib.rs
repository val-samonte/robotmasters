#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

pub mod example;
pub mod helper;
pub mod instructions;
pub mod states;

pub use example::*;
pub use helper::*;
pub use instructions::*;

declare_id!("YUe8UbyQ88GmfjUpDE6TwoUbqwaj6qteWqd2VLWoVFm");

#[program]
pub mod robot_masters {
    use super::*;

    pub fn create_game(ctx: Context<CreateGame>) -> Result<()> {
        create_game_handler(ctx)
    }

    pub fn run_game(ctx: Context<RunGame>) -> Result<()> {
        run_game_handler(ctx)
    }
}

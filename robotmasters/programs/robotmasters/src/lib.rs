use bolt_lang::prelude::*;
use ephemeral_rollups_sdk::anchor::ephemeral;

pub mod example;
pub mod instructions;
pub mod states;

pub use example::*;
pub use instructions::*;
pub use states::*;

declare_id!("7vFkE6M9xe2CMxJhPPaCHchcVhpPHDWCZsmCFjkhymM6");

#[ephemeral]
#[program]
pub mod robotmasters {

    use super::*;

    pub fn create_game(ctx: Context<CreateGame>) -> Result<()> {
        create_game_handler(ctx)
    }

    pub fn delegate_game(ctx: Context<DelegateGame>) -> Result<()> {
        delegate_game_handler(ctx)
    }

    pub fn run_game(ctx: Context<RunGame>) -> Result<()> {
        run_game_handler(ctx)
    }

    pub fn undelegate_game_game(ctx: Context<UndelegateGame>) -> Result<()> {
        undelegate_game_handler(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}

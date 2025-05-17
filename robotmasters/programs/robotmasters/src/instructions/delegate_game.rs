use bolt_lang::*;
use ephemeral_rollups_sdk::anchor::delegate;
use ephemeral_rollups_sdk::cpi::DelegateConfig;

use crate::{FromAccountInfo, GameState};

#[delegate]
#[derive(Accounts)]
pub struct DelegateGame<'info> {
    
    #[account(
        mut, 
        del,
        constraint = pda.to_account_info().owner == &crate::ID @ DelegateGameError::InvalidAccountOwner,
    )]
    pub pda: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,
}

pub fn delegate_game_handler(ctx: Context<DelegateGame>) -> Result<()> {
    let game_state = &ctx.accounts.pda;
    let info = GameState::from_account_info(&game_state.to_account_info())?;
    
    ctx.accounts
        .delegate_pda(
            &ctx.accounts.payer, 
            &[b"game_state", info.id.key().as_ref()], 
            DelegateConfig::default()
        )?;
    Ok(())
}

#[error_code]
pub enum DelegateGameError {
    #[msg("Invalid account owner")]
    InvalidAccountOwner,
}
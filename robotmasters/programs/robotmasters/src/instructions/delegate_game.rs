use bolt_lang::*;
use ephemeral_rollups_sdk::anchor::delegate;
use ephemeral_rollups_sdk::cpi::DelegateConfig;

use crate::{FromAccountInfo, GameState, GAME_STATE_SEED};

#[delegate]
#[derive(Accounts)]
pub struct DelegateGame<'info> {
    
    /// CHECK: this is the game_state, validations in handler
    #[account(
        mut, 
        del,
        constraint = pda.to_account_info().owner == &crate::ID @ DelegateGameError::InvalidAccountOwner,
    )]
    pub pda: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn delegate_game_handler(ctx: Context<DelegateGame>) -> Result<()> {
    let authority = &ctx.accounts.authority;
    let game_state = &ctx.accounts.pda;
    let info = GameState::from_account_info(&game_state.to_account_info())?;

    if info.raider.key() != authority.key() {
        return Err(DelegateGameError::Unauthorized.into());
    }

    ctx.accounts
        .delegate_pda(
            authority, 
            &[GAME_STATE_SEED, info.id.key().as_ref()], 
            DelegateConfig::default()
        )?;
    Ok(())
}

#[error_code]
pub enum DelegateGameError {
    #[msg("Unauthorized: Signer does not own the character")]
    Unauthorized,
    #[msg("Invalid account owner")]
    InvalidAccountOwner,
}
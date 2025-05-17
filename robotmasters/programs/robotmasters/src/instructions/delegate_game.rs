use bolt_lang::*;
use ephemeral_rollups_sdk::anchor::delegate;
use ephemeral_rollups_sdk::cpi::DelegateConfig;

use crate::GameState;

#[delegate]
#[derive(Accounts)]
pub struct DelegateGame<'info> {
    
    #[account(
        mut, 
        del,
        // constraint = game_state.to_account_info().owner == &crate::ID @ DelegateGameError::InvalidAccountOwner,
        // constraint = game_state.raider.key() == payer.key()
    )]
    pub game_state: Box<Account<'info, GameState>>,

    #[account(mut)]
    pub payer: Signer<'info>,
}

pub fn delegate_game_handler(ctx: Context<DelegateGame>) -> Result<()> {
    // ctx.accounts
    //     .delegate_pda(&ctx.accounts.payer, &[b"game_state"], DelegateConfig::default())?;
    
    Ok(())
}

#[error_code]
pub enum DelegateGameError {
    #[msg("Unauthorized: Signer does not own the character")]
    Unauthorized,
    #[msg("Invalid account owner")]
    InvalidAccountOwner,
}
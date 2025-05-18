use crate::GameState;
use bolt_lang::*;
use ephemeral_rollups_sdk::anchor::commit;
use ephemeral_rollups_sdk::ephem::commit_and_undelegate_accounts;

#[commit]
#[derive(Accounts)]
pub struct UndelegateGame<'info> {
    #[account(
        mut, 
        seeds = [
            b"game_state", 
            game_state.id.key().as_ref()
        ], 
        bump,
        constraint = game_state.raider.key() == authority.key() @ UndelegateGameError::Unauthorized,
        constraint = game_state.to_account_info().owner == &crate::ID @ UndelegateGameError::InvalidAccountOwner,
    )]
    pub game_state: Account<'info, GameState>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn undelegate_game_handler(ctx: Context<UndelegateGame>) -> Result<()> {
    commit_and_undelegate_accounts(
        &ctx.accounts.authority,
        vec![&ctx.accounts.game_state.to_account_info()],
        &ctx.accounts.magic_context,
        &ctx.accounts.magic_program,
    )?;
    Ok(())
}

#[error_code]
pub enum UndelegateGameError {
    #[msg("Unauthorized: Signer does not own the character")]
    Unauthorized,
    #[msg("Invalid account owner")]
    InvalidAccountOwner,
}
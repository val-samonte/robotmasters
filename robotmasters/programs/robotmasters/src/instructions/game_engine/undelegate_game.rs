use crate::GameState;
use bolt_lang::*;
use ephemeral_rollups_sdk::anchor::commit;
use ephemeral_rollups_sdk::ephem::commit_and_undelegate_accounts;

#[commit]
#[derive(Accounts)]
pub struct UndelegateGame<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut, seeds = [b"game1"], bump)]
    pub game_state: Account<'info, GameState>,
}

pub fn undelegate_game_handler(ctx: Context<UndelegateGame>) -> Result<()> {
    commit_and_undelegate_accounts(
        &ctx.accounts.payer,
        vec![&ctx.accounts.game_state.to_account_info()],
        &ctx.accounts.magic_context,
        &ctx.accounts.magic_program,
    )?;
    Ok(())
}

use bolt_lang::*;
use ephemeral_rollups_sdk::anchor::delegate;
use ephemeral_rollups_sdk::cpi::DelegateConfig;

#[delegate]
#[derive(Accounts)]
pub struct DelegateGame<'info> {
    pub payer: Signer<'info>,
    /// CHECK GameState
    #[account(mut, del)]
    pub pda: AccountInfo<'info>,
}

pub fn delegate_game_handler(ctx: Context<DelegateGame>) -> Result<()> {
    ctx.accounts
        .delegate_pda(&ctx.accounts.payer, &[b"game3"], DelegateConfig::default())?;
    Ok(())
}

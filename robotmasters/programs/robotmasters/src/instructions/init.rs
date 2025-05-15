use bolt_lang::*;

use crate::{Admin, ComponentManager, MatchCounter};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitArgs {
    treasury: Pubkey,
    item_authority: Pubkey,
    centralized_validator: Pubkey,
}

#[derive(Accounts)]
#[instruction(args: InitArgs)]
pub struct Init<'info> {
    #[account(
		init,
		payer = payer,
		seeds = [
			b"admin",
		],
		bump,
		space = Admin::len()
	)]
    pub admin: Account<'info, Admin>,

    #[account(
		init,
		payer = payer,
		seeds = [
			b"match_counter",
		],
		bump,
		space = MatchCounter::len()
	)]
    pub match_counter: Account<'info, MatchCounter>,

    #[account(
		init,
		payer = payer,
		seeds = [
			b"item_part_manager",
		],
		bump,
		space = ComponentManager::len()
	)]
    pub item_manager: Account<'info, ComponentManager>,

    #[account(
		init,
		payer = payer,
		seeds = [
			b"cond_manager",
		],
		bump,
		space = ComponentManager::len()
	)]
    pub cond_manager: Account<'info, ComponentManager>,

    #[account(
		init,
		payer = payer,
		seeds = [
			b"action_manager",
		],
		bump,
		space = ComponentManager::len()
	)]
    pub action_manager: Account<'info, ComponentManager>,

    #[account(
		init,
		payer = payer,
		seeds = [
			b"spawn_manager",
		],
		bump,
		space = ComponentManager::len()
	)]
    pub spawn_manager: Account<'info, ComponentManager>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn init_handler(ctx: Context<Init>, args: InitArgs) -> Result<()> {
    let admin = &mut ctx.accounts.admin;
    let match_counter = &mut ctx.accounts.match_counter;
    let item_manager = &mut ctx.accounts.item_manager;
    let cond_manager = &mut ctx.accounts.cond_manager;
    let action_manager = &mut ctx.accounts.action_manager;
    let spawn_manager = &mut ctx.accounts.spawn_manager;

    admin.bump = ctx.bumps.admin;
    admin.item_authority = args.item_authority;
    admin.treasury = args.treasury;
    admin.centralized_validator = args.centralized_validator;

    match_counter.bump = ctx.bumps.match_counter;
    match_counter.band = [0; 64];

    item_manager.bump = ctx.bumps.item_manager;
    item_manager.counter = 0;

    cond_manager.bump = ctx.bumps.cond_manager;
    cond_manager.counter = 0;

    action_manager.bump = ctx.bumps.action_manager;
    action_manager.counter = 0;

    spawn_manager.bump = ctx.bumps.spawn_manager;
    spawn_manager.counter = 0;

    Ok(())
}

use bolt_lang::*;

use crate::{Action, ComponentControl, ComponentManager, ComponentState, ACTION_CONTROL_SEED, ACTION_MANAGER_SEED, ACTION_SEED};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateActionArgs {
    energy_cost: u8,
    interval: u16,
    duration: u16,
	args: [Option<u8>; 4],
	script: Vec<u8>,
	spawns: Vec<u32>,
}

#[derive(Accounts)]
#[instruction(args: CreateActionArgs)]
pub struct CreateAction<'info> {

	#[account(
		init,
		payer = authority,
		seeds = [
			ACTION_SEED,
			&manager.counter.to_le_bytes()[..],
			&0_u32.to_le_bytes()[..],
		],
		bump,
		space = Action::len(args.script.len(), args.spawns.len())
	)]
	pub action: Account<'info, Action>,

	#[account(
		init,
		payer = authority,
		seeds = [
			ACTION_CONTROL_SEED,
			&manager.counter.to_le_bytes()[..],
		],
		bump,
		space = ComponentControl::len()
	)]
	pub control: Account<'info, ComponentControl>,

    #[account(
    	mut, 
		seeds = [ACTION_MANAGER_SEED], 
		bump = manager.bump
	)]
    pub manager: Account<'info, ComponentManager>,

	#[account(mut)]
	pub authority: Signer<'info>,

	pub system_program: Program<'info, System>,
}

pub fn create_action_handler(ctx: Context<CreateAction>, args: CreateActionArgs) -> Result<()> {
	let action = &mut ctx.accounts.action;
	let control = &mut ctx.accounts.control;
	let manager = &mut ctx.accounts.manager;

	control.bump = ctx.bumps.control;
	control.id = manager.counter;
	control.active = 0;
	control.counter = 0;
	control.owner = ctx.accounts.authority.key();

	action.bump = ctx.bumps.action;
	action.id = manager.counter;
	action.version = control.counter;
	action.state = ComponentState::Draft;

	action.energy_cost = args.energy_cost;
	action.interval = args.interval;
	action.duration = args.duration;
	action.args = args.args;
	action.script = args.script;
	action.spawns = args.spawns;

	manager.counter += 1;

	Ok(())
}
use bolt_lang::*;

use crate::{ComponentControl, ComponentManager, ComponentState, Condition, CONDITION_CONTROL_SEED, CONDITION_MANAGER_SEED, CONDITION_SEED};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateConditionArgs {
    energy_mul_num: u8,
    energy_mul_den: u8,
	args: [u8; 4],
	script: Vec<u8>,
}

#[derive(Accounts)]
#[instruction(args: CreateConditionArgs)]
pub struct CreateCondition<'info> {

	#[account(
		init,
		payer = authority,
		seeds = [
			CONDITION_SEED,
			&manager.counter.to_le_bytes()[..],
			&0_u32.to_le_bytes()[..],
		],
		bump,
		space = Condition::len(args.script.len())
	)]
	pub cond: Account<'info, Condition>,

	#[account(
		init,
		payer = authority,
		seeds = [
			CONDITION_CONTROL_SEED,
			&manager.counter.to_le_bytes()[..],
		],
		bump,
		space = ComponentControl::len()
	)]
	pub control: Account<'info, ComponentControl>,

    #[account(
    	mut, 
		seeds = [CONDITION_MANAGER_SEED], 
		bump = manager.bump
	)]
    pub manager: Account<'info, ComponentManager>,

	#[account(mut)]
	pub authority: Signer<'info>,

	pub system_program: Program<'info, System>,
}

pub fn create_cond_handler(ctx: Context<CreateCondition>, args: CreateConditionArgs) -> Result<()> {
	let cond = &mut ctx.accounts.cond;
	let control = &mut ctx.accounts.control;
	let manager = &mut ctx.accounts.manager;

	control.bump = ctx.bumps.control;
	control.id = manager.counter;
	control.active = 0;
	control.counter = 0;
	control.owner = ctx.accounts.authority.key();

	cond.bump = ctx.bumps.cond;
	cond.id = manager.counter;
	cond.version = control.counter;
	cond.state = ComponentState::Draft;

	cond.energy_mul_num = args.energy_mul_num;
	cond.energy_mul_den = args.energy_mul_den;
	cond.args = args.args;
	cond.script = args.script;

	manager.counter += 1;

	Ok(())
}
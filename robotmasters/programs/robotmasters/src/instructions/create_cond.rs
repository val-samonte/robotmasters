use bolt_lang::*;

use crate::{Condition, ConditionControl, ConditionManager, ConditionState};

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
			b"cond",
			&cond_manager.counter.to_le_bytes()[..],
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
			b"cond_control",
			&cond_manager.counter.to_le_bytes()[..],
		],
		bump,
		space = ConditionControl::len()
	)]
	pub cond_control: Account<'info, ConditionControl>,

    #[account(
    	mut, 
		seeds = [b"cond_manager"], 
		bump = cond_manager.bump
	)]
    pub cond_manager: Account<'info, ConditionManager>,

	#[account(mut)]
	pub authority: Signer<'info>,

	pub system_program: Program<'info, System>,
}

pub fn create_cond_handler(ctx: Context<CreateCondition>, args: CreateConditionArgs) -> Result<()> {
	let cond = &mut ctx.accounts.cond;
	let cond_control = &mut ctx.accounts.cond_control;
	let cond_manager = &mut ctx.accounts.cond_manager;

	cond_control.bump = ctx.bumps.cond_control;
	cond_control.id = cond_manager.counter;
	cond_control.active = 0;
	cond_control.counter = 0;
	cond_control.owner = ctx.accounts.authority.key();

	cond.bump = ctx.bumps.cond;
	cond.id = cond_manager.counter;
	cond.version = cond_control.counter;
	cond.state = ConditionState::Draft;

	cond.energy_mul_num = args.energy_mul_num;
	cond.energy_mul_den = args.energy_mul_den;
	cond.args = args.args;
	cond.script = args.script;

	// Created a fresh cond, so increment id
	cond_manager.counter += 1;

	Ok(())
}
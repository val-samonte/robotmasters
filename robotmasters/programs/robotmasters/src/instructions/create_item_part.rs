use bolt_lang::*;

use crate::{ComponentControl, ComponentManager, ComponentState, ItemPart};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateItemPartArgs {
	args: [u8; 4],
	script: Vec<u8>,
}

#[derive(Accounts)]
#[instruction(args: CreateItemPartArgs)]
pub struct CreateItemPart<'info> {

	#[account(
		init,
		payer = authority,
		seeds = [
			b"item_part",
			&manager.counter.to_le_bytes()[..],
			&0_u32.to_le_bytes()[..],
		],
		bump,
		space = ItemPart::len(args.script.len())
	)]
	pub item_part: Account<'info, ItemPart>,

	#[account(
		init,
		payer = authority,
		seeds = [
			b"item_part_control",
			&manager.counter.to_le_bytes()[..],
		],
		bump,
		space = ComponentControl::len()
	)]
	pub control: Account<'info, ComponentControl>,

    #[account(
    	mut, 
		seeds = [b"item_part_manager"], 
		bump = manager.bump
	)]
    pub manager: Account<'info, ComponentManager>,

	#[account(mut)]
	pub authority: Signer<'info>,

	pub system_program: Program<'info, System>,
}

pub fn create_item_part_handler(ctx: Context<CreateItemPart>, args: CreateItemPartArgs) -> Result<()> {
	let item_part = &mut ctx.accounts.item_part;
	let control = &mut ctx.accounts.control;
	let manager = &mut ctx.accounts.manager;

	control.bump = ctx.bumps.control;
	control.id = manager.counter;
	control.active = 0;
	control.counter = 0;
	control.owner = ctx.accounts.authority.key();

	item_part.bump = ctx.bumps.item_part;
	item_part.id = manager.counter;
	item_part.version = control.counter;
	item_part.state = ComponentState::Draft;

	

	manager.counter += 1;

	Ok(())
}
use bolt_lang::*;

use crate::{ComponentControl, ComponentManager, ComponentState, ItemBlueprintLink, ItemPart, ItemPartType};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateItemPartArgs {

	item_type: ItemPartType,
    item_type_variation: u8,
	item_tier: u8,

	health: u8,
	weight: u8,
	power: u8,
	energy: u8,
	energy_regen: u8,
	energy_rate: u16,
	armor: [u8; 8],

	conditions: Vec<u32>,
    actions: Vec<u32>,
    spawns: Vec<u32>,
    effects: Vec<u32>,
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
		space = ItemPart::len(
			args.conditions.len(),
			args.actions.len(),
			args.spawns.len(),
			args.effects.len(),
		)
	)]
	pub item_part: Account<'info, ItemPart>,

	#[account(
		init,
		payer = authority,
		seeds = [
			b"item_blueprint_link",
			blueprint.key().as_ref(),
		],
		bump,
		space = ItemBlueprintLink::len()
	)]
	pub item_blueprint_link: Account<'info, ItemBlueprintLink>,

	/// CHECK: will be validated when trying to equip the mint of the blueprint
	pub blueprint: UncheckedAccount<'info>,

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
	let item_blueprint_link = &mut ctx.accounts.item_blueprint_link;

	control.bump = ctx.bumps.control;
	control.id = manager.counter;
	control.active = 0;
	control.counter = 0;
	control.owner = ctx.accounts.authority.key();

	item_blueprint_link.bump = ctx.bumps.item_blueprint_link;
	item_blueprint_link.id = manager.counter;
	item_blueprint_link.blueprint = ctx.accounts.blueprint.key();

	item_part.bump = ctx.bumps.item_part;
	item_part.id = manager.counter;
	item_part.version = control.counter;
	item_part.state = ComponentState::Draft;
	
	item_part.item_type = args.item_type;
	item_part.item_type_variation = args.item_type_variation;
	item_part.item_tier = args.item_tier;

	item_part.health = args.health;
	item_part.weight = args.weight;
	item_part.power = args.power;
	item_part.energy = args.energy;
	item_part.energy_regen = args.energy_regen;
	item_part.energy_rate = args.energy_rate;
	item_part.armor = args.armor;
	
	// TODO: validations of the IDs included with conditions, actions, spawns and effects (all components must be in published state)
	// TODO: remaining accounts: include actions, spawns and add their IDs in this account's spawn IDs
	// for now, do it client side

	item_part.conditions = args.conditions;
	item_part.actions = args.actions;
	item_part.spawns = args.spawns;
	item_part.effects = args.effects;
	
	manager.counter += 1;

	Ok(())
}
use bolt_lang::*;

use crate::{Admin, ComponentControl, ComponentState, ItemPart};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct VersionItemPartArgs {
    item_type_variation: u8,
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
#[instruction(args: VersionItemPartArgs)]
pub struct VersionItemPart<'info> {
    #[account(
		init,
		payer = signer,
		seeds = [
			b"item_part",
			&control.id.to_le_bytes()[..],
			&(control.counter + 1).to_le_bytes()[..],
		],
		bump,
		space = ItemPart::len(
			args.conditions.len(),
			args.actions.len(),
			args.spawns.len(),
			args.effects.len(),
		)
	)]
    pub new_item_part: Account<'info, ItemPart>,

    #[account(
		seeds = [
			b"item_part",
			&control.id.to_le_bytes()[..],
			&control.active.to_le_bytes()[..],
		],
		bump,
		constraint = match old_item_part.state {
			ComponentState::Published => true,
			_ => false
		} @ VersionItemPartError::InvalidState
	)]
    pub old_item_part: Account<'info, ItemPart>,

    #[account(
		mut,
		seeds = [
			b"item_part_control",
			&old_item_part.id.to_le_bytes()[..],
		],
		bump = control.bump
	)]
    pub control: Account<'info, ComponentControl>,

    #[account(
		seeds = [b"admin"],
		bump = admin.bump
	)]
    pub admin: Account<'info, Admin>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn version_item_part_handler(
    ctx: Context<VersionItemPart>,
    args: VersionItemPartArgs,
) -> Result<()> {
    let signer = ctx.accounts.signer.key();
    let old_item_part = &ctx.accounts.old_item_part;
    let new_item_part = &mut ctx.accounts.new_item_part;
    let control = &mut ctx.accounts.control;

    let is_authorized = ctx.accounts.admin.key() == signer || control.owner.key() == signer;

    if !is_authorized {
        return Err(VersionItemPartError::Unauthorize.into());
    }

    // old_item_part.state = ItemPartState::Deprecated;
    control.counter += 1;
    // control.active = control.counter;

    new_item_part.bump = ctx.bumps.new_item_part;
    new_item_part.version = control.counter;
    new_item_part.state = ComponentState::Draft;

    new_item_part.item_type = old_item_part.item_type; // retain the part type
    new_item_part.item_type_variation = args.item_type_variation;
    new_item_part.health = args.health;
    new_item_part.weight = args.weight;
    new_item_part.power = args.power;
    new_item_part.energy = args.energy;
    new_item_part.energy_regen = args.energy_regen;
    new_item_part.energy_rate = args.energy_rate;
    new_item_part.armor = args.armor;

    // TODO: remaining accounts: include actions, spawns and add their IDs in this account's spawn IDs
    // for now, do it client side

    new_item_part.conditions = args.conditions;
    new_item_part.actions = args.actions;
    new_item_part.spawns = args.spawns;
    new_item_part.effects = args.effects;

    Ok(())
}

#[error_code]
pub enum VersionItemPartError {
    #[msg("Signer is not authorized to update this account.")]
    Unauthorize,

    #[msg("Only Published accounts can have new versions.")]
    InvalidState,
}

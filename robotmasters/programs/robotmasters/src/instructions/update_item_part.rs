use bolt_lang::*;

use crate::{
    Admin, ComponentControl, ComponentState, ItemPart, ADMIN_SEED, ITEM_PART_CONTROL_SEED,
    ITEM_PART_SEED,
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct UpdateItemPartArgs {
    state: ComponentState,
    item_type_variation: Option<u8>,
    item_tier: Option<u8>,
    health: Option<u8>,
    weight: Option<u8>,
    power: Option<u8>,
    energy: Option<u8>,
    energy_regen: Option<u8>,
    energy_rate: Option<u16>,
    armor: Option<[u8; 8]>,
    conditions: Option<Vec<u32>>,
    actions: Option<Vec<u32>>,
    spawns: Option<Vec<u32>>,
    effects: Option<Vec<u32>>,
}

#[derive(Accounts)]
#[instruction(args: UpdateItemPartArgs)]
pub struct UpdateItemPart<'info> {
    #[account(
		mut,
		seeds = [
			ITEM_PART_SEED,
			&item_part.id.to_le_bytes()[..],
			&item_part.version.to_le_bytes()[..],
		],
		bump = item_part.bump
	)]
    pub item_part: Account<'info, ItemPart>,

    #[account(
		seeds = [
			ITEM_PART_CONTROL_SEED,
			&item_part.id.to_le_bytes()[..],
		],
		bump = control.bump
	)]
    pub control: Account<'info, ComponentControl>,

    #[account(
		seeds = [ADMIN_SEED],
		bump = admin.bump
	)]
    pub admin: Account<'info, Admin>,

    #[account(mut)]
    pub signer: Signer<'info>,
}

pub fn update_item_part_handler(
    ctx: Context<UpdateItemPart>,
    args: UpdateItemPartArgs,
) -> Result<()> {
    let signer = ctx.accounts.signer.key();
    let item_part = &mut ctx.accounts.item_part;
    let control = &ctx.accounts.control;
    let admin = &ctx.accounts.admin;

    let is_authorized = match item_part.state {
        ComponentState::Draft => control.owner == signer || admin.item_authority == signer,
        _ => admin.item_authority == signer,
    };

    if !is_authorized {
        return Err(UpdateItemPartError::Unauthorize.into());
    }

    item_part.state = args.state;

    if let Some(item_type_variation) = args.item_type_variation {
        item_part.item_type_variation = item_type_variation;
    }

    if let Some(item_tier) = args.item_tier {
        item_part.item_tier = item_tier;
    }

    if let Some(health) = args.health {
        item_part.health = health;
    }

    if let Some(weight) = args.weight {
        item_part.weight = weight;
    }

    if let Some(power) = args.power {
        item_part.power = power;
    }

    if let Some(energy) = args.energy {
        item_part.energy = energy;
    }

    if let Some(energy_regen) = args.energy_regen {
        item_part.energy_regen = energy_regen;
    }

    if let Some(energy_rate) = args.energy_rate {
        item_part.energy_rate = energy_rate;
    }

    if let Some(armor) = args.armor {
        item_part.armor = armor;
    }

    if let Some(conditions) = args.conditions {
        item_part.conditions = conditions;
    }

    if let Some(actions) = args.actions {
        item_part.actions = actions;
    }

    if let Some(spawns) = args.spawns {
        item_part.spawns = spawns;
    }

    if let Some(effects) = args.effects {
        item_part.effects = effects;
    }

    Ok(())
}

#[error_code]
pub enum UpdateItemPartError {
    #[msg("Signer is not authorized to update this account.")]
    Unauthorize,
}

use bolt_lang::*;

// TODO: handle resizing

use crate::{
    Admin, ComponentControl, ComponentState, Element, Spawn, ADMIN_SEED, SPAWN_CONTROL_SEED,
    SPAWN_SEED,
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct UpdateSpawnArgs {
    state: ComponentState,
    health_cap: Option<u8>,
    duration: Option<u16>,
    damage_base: Option<u8>,
    damage_range: Option<u8>,
    crit_chance: Option<u8>,
    crit_multiplier: Option<u8>,
    element: Option<u8>,
    destroy_on_collision: Option<bool>,
    width: Option<u8>,
    height: Option<u8>,
    output_x: Option<u8>,
    output_y: Option<u8>,
    args: Option<[Option<u8>; 4]>,
    script: Option<Vec<u8>>,
    spawns: Option<Vec<u32>>,
}

#[derive(Accounts)]
#[instruction(args: UpdateSpawnArgs)]
pub struct UpdateSpawn<'info> {
    #[account(
		mut,
		seeds = [
			SPAWN_SEED,
			&spawn.id.to_le_bytes()[..],
			&spawn.version.to_le_bytes()[..],
		],
		bump = spawn.bump
	)]
    pub spawn: Account<'info, Spawn>,

    #[account(
		seeds = [
			SPAWN_CONTROL_SEED,
			&spawn.id.to_le_bytes()[..],
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

pub fn update_spawn_handler(ctx: Context<UpdateSpawn>, args: UpdateSpawnArgs) -> Result<()> {
    let signer = ctx.accounts.signer.key();
    let spawn = &mut ctx.accounts.spawn;
    let control = &ctx.accounts.control;
    let admin = &ctx.accounts.admin;

    let is_authorized = match spawn.state {
        ComponentState::Draft => control.owner == signer || admin.item_authority == signer,
        _ => admin.item_authority == signer,
    };

    if !is_authorized {
        return Err(UpdateSpawnError::Unauthorize.into());
    }

    spawn.state = args.state;

    if let Some(health_cap) = args.health_cap {
        spawn.health_cap = health_cap;
    }

    if let Some(duration) = args.duration {
        spawn.duration = duration;
    }

    if let Some(damage_base) = args.damage_base {
        spawn.damage_base = damage_base;
    }

    if let Some(damage_range) = args.damage_range {
        spawn.damage_range = damage_range;
    }

    if let Some(crit_chance) = args.crit_chance {
        spawn.crit_chance = crit_chance;
    }

    if let Some(crit_multiplier) = args.crit_multiplier {
        spawn.crit_multiplier = crit_multiplier;
    }

    if let Some(element) = args.element {
        spawn.element = Element::from_byte(element).unwrap();
    }

    if let Some(destroy_on_collision) = args.destroy_on_collision {
        spawn.destroy_on_collision = destroy_on_collision;
    }

    if let Some(width) = args.width {
        spawn.width = width;
    }

    if let Some(height) = args.height {
        spawn.height = height;
    }

    if let Some(output_x) = args.output_x {
        spawn.output_x = output_x;
    }

    if let Some(output_y) = args.output_y {
        spawn.output_y = output_y;
    }

    if let Some(spawns) = args.spawns {
        spawn.spawns = spawns;
    }

    Ok(())
}

#[error_code]
pub enum UpdateSpawnError {
    #[msg("Signer is not authorized to update this account.")]
    Unauthorize,
}

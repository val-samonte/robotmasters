use bolt_lang::*;

use crate::{Admin, ComponentControl, ComponentState, Element, Spawn};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct VersionSpawnArgs {
    health_cap: u8,
    duration: u16,
    damage_base: u8,
    damage_range: u8,
    crit_chance: u8,
    crit_multiplier: u8,
    element: u8,
    destroy_on_collision: bool,
    width: u8,
    height: u8,
    output_x: u8,
    output_y: u8,
    args: [u8; 4],
    script: Vec<u8>,
}

#[derive(Accounts)]
#[instruction(args: VersionSpawnArgs)]
pub struct VersionSpawn<'info> {
    #[account(
		init,
		payer = signer,
		seeds = [
			b"spawn",
			&control.id.to_le_bytes()[..],
			&(control.counter + 1).to_le_bytes()[..],
		],
		bump,
		space = Spawn::len(args.script.len()),
	)]
    pub new_spawn: Account<'info, Spawn>,

    #[account(
		seeds = [
			b"spawn",
			&control.id.to_le_bytes()[..],
			&control.active.to_le_bytes()[..],
		],
		bump,
		constraint = match old_spawn.state {
			ComponentState::Published => true,
			_ => false
		} @ VersionSpawnError::InvalidState
	)]
    pub old_spawn: Account<'info, Spawn>,

    #[account(
		mut,
		seeds = [
			b"spawn_control",
			&old_spawn.id.to_le_bytes()[..],
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

pub fn version_spawn_handler(ctx: Context<VersionSpawn>, args: VersionSpawnArgs) -> Result<()> {
    let signer = ctx.accounts.signer.key();
    let new_spawn = &mut ctx.accounts.new_spawn;
    let control = &mut ctx.accounts.control;

    let is_authorized = ctx.accounts.admin.key() == signer || control.owner.key() == signer;

    if !is_authorized {
        return Err(VersionSpawnError::Unauthorize.into());
    }

    // old_spawn.state = SpawnState::Deprecated;
    control.counter += 1;
    // control.active = control.counter;

    new_spawn.bump = ctx.bumps.new_spawn;
    new_spawn.version = control.counter;
    new_spawn.state = ComponentState::Draft;

    new_spawn.health_cap = args.health_cap;
    new_spawn.duration = args.duration;
    new_spawn.damage_base = args.damage_base;
    new_spawn.damage_range = args.damage_range;
    // todo: void crit traits if element is not sever
    new_spawn.crit_chance = args.crit_chance;
    new_spawn.crit_multiplier = args.crit_multiplier;
    new_spawn.element = Element::from_byte(args.element).unwrap();
    new_spawn.destroy_on_collision = args.destroy_on_collision;
    new_spawn.width = args.width;
    new_spawn.height = args.height;
    new_spawn.output_x = args.output_x;
    new_spawn.output_y = args.output_y;

    new_spawn.args = args.args;
    new_spawn.script = args.script;

    Ok(())
}

#[error_code]
pub enum VersionSpawnError {
    #[msg("Signer is not authorized to update this account.")]
    Unauthorize,

    #[msg("Only Published accounts can have new versions.")]
    InvalidState,
}

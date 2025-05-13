use bolt_lang::*;

use crate::{ComponentControl, ComponentManager, ComponentState, Element, Spawn};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateSpawnArgs {
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
#[instruction(args: CreateSpawnArgs)]
pub struct CreateSpawn<'info> {

	#[account(
		init,
		payer = authority,
		seeds = [
			b"spawn",
			&manager.counter.to_le_bytes()[..],
			&0_u32.to_le_bytes()[..],
		],
		bump,
		space = Spawn::len(args.script.len())
	)]
	pub spawn: Account<'info, Spawn>,

	#[account(
		init,
		payer = authority,
		seeds = [
			b"spawn_control",
			&manager.counter.to_le_bytes()[..],
		],
		bump,
		space = ComponentControl::len()
	)]
	pub control: Account<'info, ComponentControl>,

    #[account(
    	mut, 
		seeds = [b"spawn_manager"], 
		bump = manager.bump
	)]
    pub manager: Account<'info, ComponentManager>,

	#[account(mut)]
	pub authority: Signer<'info>,

	pub system_program: Program<'info, System>,
}

pub fn create_spawn_handler(ctx: Context<CreateSpawn>, args: CreateSpawnArgs) -> Result<()> {
	let spawn = &mut ctx.accounts.spawn;
	let control = &mut ctx.accounts.control;
	let manager = &mut ctx.accounts.manager;

	control.bump = ctx.bumps.control;
	control.id = manager.counter;
	control.active = 0;
	control.counter = 0;
	control.owner = ctx.accounts.authority.key();

	spawn.bump = ctx.bumps.spawn;
	spawn.id = manager.counter;
	spawn.version = control.counter;
	spawn.state = ComponentState::Draft;

	spawn.health_cap = args.health_cap;
	spawn.duration = args.duration;
	spawn.damage_base = args.damage_base;
	spawn.damage_range = args.damage_range;
	// todo: void crit traits if element is not sever
	spawn.crit_chance = args.crit_chance;
	spawn.crit_multiplier = args.crit_multiplier;
	spawn.element = Element::from_byte(args.element).unwrap();
	spawn.destroy_on_collision = args.destroy_on_collision;
	spawn.width = args.width;
	spawn.height = args.height;
	spawn.output_x = args.output_x;
	spawn.output_y = args.output_y;

	spawn.args = args.args;
	spawn.script = args.script;

	manager.counter += 1;

	Ok(())
}
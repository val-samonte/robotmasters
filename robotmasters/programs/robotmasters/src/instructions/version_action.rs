use bolt_lang::*;

use crate::{Action, Admin, ComponentControl, ComponentState};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct VersionActionArgs {
    energy_cost: u8,
    interval: u16,
    duration: u16,
    args: [u8; 4],
    script: Vec<u8>,
}

#[derive(Accounts)]
#[instruction(args: VersionActionArgs)]
pub struct VersionAction<'info> {
    #[account(
		init,
		payer = signer,
		seeds = [
			b"action",
			&control.id.to_le_bytes()[..],
			&(control.counter + 1).to_le_bytes()[..],
		],
		bump,
		space = Action::len(args.script.len()),
	)]
    pub new_action: Account<'info, Action>,

    #[account(
		seeds = [
			b"action",
			&control.id.to_le_bytes()[..],
			&control.active.to_le_bytes()[..],
		],
		bump,
		constraint = match old_action.state {
			ComponentState::Published => true,
			_ => false
		} @ VersionActionError::InvalidState
	)]
    pub old_action: Account<'info, Action>,

    #[account(
		mut,
		seeds = [
			b"action_control",
			&old_action.id.to_le_bytes()[..],
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

pub fn version_action_handler(ctx: Context<VersionAction>, args: VersionActionArgs) -> Result<()> {
    let signer = ctx.accounts.signer.key();
    let new_action = &mut ctx.accounts.new_action;
    let control = &mut ctx.accounts.control;

    let is_authorized = ctx.accounts.admin.key() == signer || control.owner.key() == signer;

    if !is_authorized {
        return Err(VersionActionError::Unauthorize.into());
    }

    // old_action.state = ActionState::Deprecated;
    control.counter += 1;
    // control.active = control.counter;

    new_action.bump = ctx.bumps.new_action;
    new_action.version = control.counter;
    new_action.state = ComponentState::Draft;
    new_action.energy_cost = args.energy_cost;
    new_action.interval = args.interval;
    new_action.duration = args.duration;
    new_action.args = args.args;
    new_action.script = args.script;

    Ok(())
}

#[error_code]
pub enum VersionActionError {
    #[msg("Signer is not authorized to update this account.")]
    Unauthorize,

    #[msg("Only Published accounts can have new versions.")]
    InvalidState,
}

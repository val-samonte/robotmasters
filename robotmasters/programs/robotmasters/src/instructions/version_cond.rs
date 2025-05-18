use bolt_lang::*;

use crate::{
    Admin, ComponentControl, ComponentState, Condition, ADMIN_SEED, CONDITION_CONTROL_SEED,
    CONDITION_SEED,
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct VersionConditionArgs {
    energy_mul_num: u8,
    energy_mul_den: u8,
    args: [u8; 4],
    script: Vec<u8>,
}

#[derive(Accounts)]
#[instruction(args: VersionConditionArgs)]
pub struct VersionCondition<'info> {
    #[account(
		init,
		payer = signer,
		seeds = [
			CONDITION_SEED,
			&control.id.to_le_bytes()[..],
			&(control.counter + 1).to_le_bytes()[..],
		],
		bump,
		space = Condition::len(args.script.len()),
	)]
    pub new_cond: Account<'info, Condition>,

    #[account(
		seeds = [
			CONDITION_SEED,
			&control.id.to_le_bytes()[..],
			&control.active.to_le_bytes()[..],
		],
		bump,
		constraint = match old_cond.state {
			ComponentState::Published => true,
			_ => false
		} @ VersionCondError::InvalidState
	)]
    pub old_cond: Account<'info, Condition>,

    #[account(
		mut,
		seeds = [
			CONDITION_CONTROL_SEED,
			&old_cond.id.to_le_bytes()[..],
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

    pub system_program: Program<'info, System>,
}

pub fn version_cond_handler(
    ctx: Context<VersionCondition>,
    args: VersionConditionArgs,
) -> Result<()> {
    let signer = ctx.accounts.signer.key();
    let new_cond = &mut ctx.accounts.new_cond;
    let control = &mut ctx.accounts.control;

    let is_authorized = ctx.accounts.admin.key() == signer || control.owner.key() == signer;

    if !is_authorized {
        return Err(VersionCondError::Unauthorize.into());
    }

    // old_cond.state = ConditionState::Deprecated;
    control.counter += 1;
    // control.active = control.counter;

    new_cond.bump = ctx.bumps.new_cond;
    new_cond.version = control.counter;
    new_cond.state = ComponentState::Draft;
    new_cond.energy_mul_num = args.energy_mul_num;
    new_cond.energy_mul_den = args.energy_mul_den;
    new_cond.args = args.args;
    new_cond.script = args.script;

    Ok(())
}

#[error_code]
pub enum VersionCondError {
    #[msg("Signer is not authorized to update this account.")]
    Unauthorize,

    #[msg("Only Published accounts can have new versions.")]
    InvalidState,
}

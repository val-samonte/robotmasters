use bolt_lang::*;

use crate::{Admin, Condition, ConditionControl, ConditionState};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct VersionConditionArgs {
    energy_mul_num: u8,
    energy_mul_den: u8,
    script: Vec<u8>,
}

#[derive(Accounts)]
#[instruction(args: VersionConditionArgs)]
pub struct VersionCondition<'info> {
    #[account(
		init,
		payer = signer,
		seeds = [
			b"cond",
			&cond_control.id.to_le_bytes()[..],
			&(cond_control.counter + 1).to_le_bytes()[..],
		],
		bump,
		space = Condition::len(args.script.len()),
	)]
    pub new_cond: Account<'info, Condition>,

    #[account(
		seeds = [
			b"cond",
			&cond_control.id.to_le_bytes()[..],
			&cond_control.active.to_le_bytes()[..],
		],
		bump,
		constraint = match old_cond.state {
			ConditionState::Published => true,
			_ => false
		} @ VersionCondError::InvalidState
	)]
    pub old_cond: Account<'info, Condition>,

    #[account(
		mut,
		seeds = [
			b"cond_control",
			&old_cond.id.to_le_bytes()[..],
		],
		bump = cond_control.bump
	)]
    pub cond_control: Account<'info, ConditionControl>,

    #[account(
		seeds = [b"admin"],
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
    let cond_control = &mut ctx.accounts.cond_control;

    let is_authorized = ctx.accounts.admin.key() == signer || cond_control.owner.key() == signer;

    if !is_authorized {
        return Err(VersionCondError::Unauthorize.into());
    }

    // old_cond.state = ConditionState::Deprecated;
    cond_control.counter += 1;
    cond_control.active = cond_control.counter;

    new_cond.bump = ctx.bumps.new_cond;
    new_cond.state = ConditionState::Draft;
    new_cond.energy_mul_num = args.energy_mul_num;
    new_cond.energy_mul_den = args.energy_mul_den;
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

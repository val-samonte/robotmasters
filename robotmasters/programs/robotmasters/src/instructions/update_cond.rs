use bolt_lang::*;

use crate::{
    Admin, ComponentControl, ComponentState, Condition, ADMIN_SEED, CONDITION_CONTROL_SEED,
    CONDITION_SEED,
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct UpdateConditionArgs {
    state: ComponentState,
    energy_mul_num: Option<u8>,
    energy_mul_den: Option<u8>,
    args: Option<[u8; 4]>,
    script: Option<Vec<u8>>,
}

#[derive(Accounts)]
#[instruction(args: UpdateConditionArgs)]
pub struct UpdateCondition<'info> {
    #[account(
		mut,
		seeds = [
			CONDITION_SEED,
			&cond.id.to_le_bytes()[..],
			&cond.version.to_le_bytes()[..],
		],
		bump = cond.bump
	)]
    pub cond: Account<'info, Condition>,

    #[account(
		seeds = [
			CONDITION_CONTROL_SEED,
			&cond.id.to_le_bytes()[..],
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

pub fn update_cond_handler(ctx: Context<UpdateCondition>, args: UpdateConditionArgs) -> Result<()> {
    let signer = ctx.accounts.signer.key();
    let cond = &mut ctx.accounts.cond;
    let control = &ctx.accounts.control;
    let admin = &ctx.accounts.admin;

    let is_authorized = match cond.state {
        ComponentState::Draft => control.owner == signer || admin.item_authority == signer,
        _ => admin.item_authority == signer,
    };

    if !is_authorized {
        return Err(UpdateCondError::Unauthorize.into());
    }

    cond.state = args.state;

    if let Some(energy_mul_num) = args.energy_mul_num {
        cond.energy_mul_num = energy_mul_num;
    }

    if let Some(energy_mul_den) = args.energy_mul_den {
        cond.energy_mul_den = energy_mul_den;
    }

    if let Some(args) = args.args {
        cond.args = args;
    }

    if let Some(script) = args.script {
        cond.script = script;
    }

    Ok(())
}

#[error_code]
pub enum UpdateCondError {
    #[msg("Signer is not authorized to update this account.")]
    Unauthorize,
}

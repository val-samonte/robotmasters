use bolt_lang::*;

use crate::{Action, Admin, ComponentControl, ComponentState};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct UpdateActionArgs {
    state: ComponentState,
    energy_cost: Option<u8>,
    interval: Option<u16>,
    duration: Option<u16>,
    args: Option<[Option<u8>; 4]>,
    script: Option<Vec<u8>>,
    spawns: Option<Vec<u32>>,
}

#[derive(Accounts)]
#[instruction(args: UpdateActionArgs)]
pub struct UpdateAction<'info> {
    #[account(
		mut,
		seeds = [
			b"action",
			&action.id.to_le_bytes()[..],
			&action.version.to_le_bytes()[..],
		],
		bump = action.bump
	)]
    pub action: Account<'info, Action>,

    #[account(
		seeds = [
			b"action_control",
			&action.id.to_le_bytes()[..],
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
}

pub fn update_action_handler(ctx: Context<UpdateAction>, args: UpdateActionArgs) -> Result<()> {
    let signer = ctx.accounts.signer.key();
    let action = &mut ctx.accounts.action;
    let control = &ctx.accounts.control;
    let admin = &ctx.accounts.admin;

    let is_authorized = match action.state {
        ComponentState::Draft => control.owner == signer || admin.item_authority == signer,
        _ => admin.item_authority == signer,
    };

    if !is_authorized {
        return Err(UpdateActionError::Unauthorize.into());
    }

    action.state = args.state;

    if let Some(energy_cost) = args.energy_cost {
        action.energy_cost = energy_cost;
    }

    if let Some(interval) = args.interval {
        action.interval = interval;
    }

    if let Some(duration) = args.duration {
        action.duration = duration;
    }

    if let Some(args) = args.args {
        action.args = args;
    }

    if let Some(script) = args.script {
        action.script = script;
    }

    if let Some(spawns) = args.spawns {
        action.spawns = spawns;
    }

    Ok(())
}

#[error_code]
pub enum UpdateActionError {
    #[msg("Signer is not authorized to update this account.")]
    Unauthorize,
}

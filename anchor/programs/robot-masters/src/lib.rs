use anchor_lang::prelude::*;

declare_id!("YUe8UbyQ88GmfjUpDE6TwoUbqwaj6qteWqd2VLWoVFm");

#[program]
pub mod robot_masters {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

use bolt_lang::prelude::*;

declare_id!("2kdwQHLg92rzur3uWinZTECYByduNMsyHreV7HviPfF1");

#[program]
pub mod robot_masters {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

use bolt_lang::prelude::*;

declare_id!("7vFkE6M9xe2CMxJhPPaCHchcVhpPHDWCZsmCFjkhymM6");

#[program]
pub mod robotmasters {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

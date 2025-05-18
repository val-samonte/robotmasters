// initialize a demo game
use crate::{states::GameState, GAME_STATE_SEED};
use bolt_lang::*;
use rmengine::structs::Game;

#[derive(Accounts)]
pub struct RunGame<'info> {
    #[account(
		mut,
        seeds = [
            GAME_STATE_SEED, 
            game_state.id.key().as_ref()
        ],
        bump = game_state.bump,
        constraint = game_state.raider.key() == authority.key() @ RunGameError::Unauthorized,
        constraint = game_state.to_account_info().owner == &crate::ID @ RunGameError::InvalidAccountOwner,
	)]
    pub game_state: Box<Account<'info, GameState>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn run_game_handler(ctx: Context<RunGame>) -> Result<()> {
    let game_state = &mut ctx.accounts.game_state;
    let data = &game_state.data[..game_state.len as usize];

    let mut game = Game::import_state(&data).unwrap();

    // run next_frame 10 times
    let mut i = 0;
    while i < 6 {
        game.next_frame();
        i += 1;
    }

    game_state.frame = game.game_state.frame;

    let state = game.export_state().unwrap();
    let len = state.len();
    if len > 3600 {
        return Err(RunGameError::DataTooLarge.into());
    }

    game_state.len = len as u16;
    game_state.data[..len].copy_from_slice(&state);

    Ok(())
}

#[error_code]
pub enum RunGameError {
    #[msg("Unauthorized: Signer does not own the character")]
    Unauthorized,
    #[msg("Invalid account owner")]
    InvalidAccountOwner,
    #[msg("Game state data is too large to store")]
    DataTooLarge,
}

// initialize a demo game
use anchor_lang::prelude::*;

use rmengine::structs::Game;
use crate::{action_def, character_behaviors, character_def, condition_def, spawn_def, states::GameState, tile_map};

#[derive(Accounts)]
pub struct CreateGame<'info> {
  #[account(
    init, 
    payer = authority, 
    seeds = [
		b"game",
    ], 
    bump, 
    space = GameState::len()
  )]
  pub game_state: Box<Account<'info, GameState>>,

  #[account(mut)]
  pub authority: Signer<'info>,

  pub system_program: Program<'info, System>,
}

pub fn create_game_handler(ctx: Context<CreateGame>) -> Result<()> {
  
	let game_state = &mut ctx.accounts.game_state;

	game_state.bump = ctx.bumps.game_state;

	let game = Game::init(
		125,
		false,
		tile_map(),
		(1, 2),
		character_def(),
		character_behaviors(),
		spawn_def(),
		action_def(),
		condition_def(),
		vec![],
	);
	

	let state = game.export_state().unwrap();
	let len = state.len();
	if len > 3000 {
        return Err(CreateGameError::DataTooLarge.into());
    }

	game_state.len = len as u16;
	game_state.frame = game.game_state.frame;

	game_state.data[..len].copy_from_slice(&state);

	// todo: store initial state hash

	Ok(())
}

#[error_code]
pub enum CreateGameError {
  #[msg("Game state data is too large to store")]
  DataTooLarge,
}
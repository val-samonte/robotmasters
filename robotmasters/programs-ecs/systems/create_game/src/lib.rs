use bolt_lang::*;
use game_state::GameState;

pub mod example;
pub use example::*;

declare_id!("Er2CNhqnMCr2moBM4W5NNFhQ7GfzRo8r3dWjcG5VgakF");

#[system]
pub mod create_game {
    use rmengine::structs::Game;

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        let game_state = &mut ctx.accounts.game_state;

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
        if len > 3600 {
            return Err(CreateGameError::DataTooLarge.into());
        }

        game_state.len = len as u16;
        game_state.frame = game.game_state.frame;
        game_state.data.0[..len].copy_from_slice(&state);

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub game_state: GameState,
    }
}

#[error_code]
pub enum CreateGameError {
    #[msg("Game state data is too large to store")]
    DataTooLarge,
}

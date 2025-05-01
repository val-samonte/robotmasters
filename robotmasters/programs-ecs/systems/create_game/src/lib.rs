use bolt_lang::*;
use game_state::GameState;

pub mod example;
pub use example::*;

declare_id!("Er2CNhqnMCr2moBM4W5NNFhQ7GfzRo8r3dWjcG5VgakF");

#[system]
pub mod create_game {
    use rmengine::structs::Game;

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        let mut game_states = [
            &mut ctx.accounts.game_state_0,
            &mut ctx.accounts.game_state_1,
            &mut ctx.accounts.game_state_2,
        ];

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
        let total_len = state.len();
        if total_len > 2400 {
            return Err(CreateGameError::DataTooLarge.into());
        }

        let shard_size = 800;
        let mut offset = 0;

        for (i, game_state) in game_states.iter_mut().enumerate() {
            let len = std::cmp::min(shard_size, total_len - offset);
            game_state.len = len as u16;
            game_state.shard_id = i as u8;
            if len > 0 {
                game_state.data.0[..len].copy_from_slice(&state[offset..offset + len]);
            }
            offset += len;
        }

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub game_state_0: GameState,
        pub game_state_1: GameState,
        pub game_state_2: GameState,
    }
}

#[error_code]
pub enum CreateGameError {
    #[msg("Game state data is too large to store")]
    DataTooLarge,
}

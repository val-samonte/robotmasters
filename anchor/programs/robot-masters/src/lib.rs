#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

pub mod example;
pub mod helper;

pub use example::*;
pub use helper::*;

declare_id!("YUe8UbyQ88GmfjUpDE6TwoUbqwaj6qteWqd2VLWoVFm");

#[program]
pub mod robot_masters {

    use rmengine::structs::Game;

    use super::*;

    // // Solana-specific logger
    // struct SolanaLogger;

    // impl logger::Logger for SolanaLogger {
    //     fn log(&self, message: &str) {
    //         msg!("{}", message);
    //     }

    //     fn warn(&self, message: &str) {
    //         msg!("WARN: {}", message);
    //     }

    //     fn error(&self, message: &str) {
    //         msg!("ERROR: {}", message);
    //     }
    // }

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Initializing robot-masters program");

        // // Initialize Solana logger
        // static SOLANA_LOGGER: SolanaLogger = SolanaLogger;
        // set_logger(&SOLANA_LOGGER);

        let tile_map = vec![
            vec![1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            vec![1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            vec![1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            vec![1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
            vec![1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            vec![1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            vec![1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        // Create components
        let mut characters = vec![gen_character(0), gen_character(1)];
        let mut conditions = vec![
            cond_energy20().expect("Failed to create cond_energy20"),
            cond_leaning().expect("Failed to create cond_leaning"),
            cond_always().expect("Failed to create cond_always"),
            cond_rand20().expect("Failed to create cond_rand20"),
        ];
        let mut actions = vec![
            action_charge().expect("Failed to create action_charge"),
            action_turn().expect("Failed to create action_turn"),
            action_run().expect("Failed to create action_run"),
            action_jump().expect("Failed to create action_jump"),
            action_shoot(ShootArgs {
                energy_cost: 5,
                rate_of_fire: 2,
                reload_duration: 120,
                round_capacity: 5,
            })
            .expect("Failed to create action_shoot"),
        ];
        let mut spawns = vec![spawn_bullet().expect("Failed to create spawn_bullet")];

        let mut builder = GameBuilder::new();
        builder.reset();

        // Register components
        let _char1_id = builder.register_character(&characters[0]);
        let _char2_id = builder.register_character(&characters[1]);

        for condition in conditions.iter_mut() {
            let id = builder.register_condition(condition);
            condition.id = Some(id);
        }

        for action in actions.iter_mut() {
            let id = builder.register_action(action);
            action.id = Some(id);
        }

        let bullet_id = builder.register_spawn(&spawns[0]);
        spawns[0].id = Some(bullet_id);

        // Associate spawn with shoot action
        actions[4].add_spawn(bullet_id);

        // Configure character1
        characters[0]
            .set_cpu(&[
                conditions[0].clone(),
                conditions[1].clone(),
                conditions[2].clone(),
                conditions[3].clone(),
            ])
            .expect("Failed to set CPU for character1");
        characters[0]
            .attach_action(0, &actions[0])
            .expect("Failed to attach charge to character1");
        characters[0]
            .attach_action(1, &actions[1])
            .expect("Failed to attach turn to character1");
        characters[0]
            .attach_action(2, &actions[3])
            .expect("Failed to attach jump to character1");
        characters[0]
            .attach_action(3, &actions[2])
            .expect("Failed to attach run to character1");

        // Configure character2
        characters[1]
            .set_cpu(&[
                conditions[0].clone(),
                conditions[1].clone(),
                conditions[2].clone(),
                conditions[3].clone(),
            ])
            .expect("Failed to set CPU for character2");
        characters[1]
            .attach_action(0, &actions[0])
            .expect("Failed to attach charge to character2");
        characters[1]
            .attach_action(1, &actions[1])
            .expect("Failed to attach turn to character2");
        characters[1]
            .attach_action(2, &actions[4])
            .expect("Failed to attach shoot to character2");
        characters[1]
            .attach_action(3, &actions[2])
            .expect("Failed to attach run to character2");

        // Compose the game
        let mut game = builder.compose(
            125,
            false,
            tile_map,
            (0, 1),
            &characters,
            &conditions,
            &actions,
            &spawns,
        );

        game.next_frame();

        let state = game.export_state();
        let bytes = state.unwrap();

        msg!("Game size: {:?}", bytes.len());

        let new_game = Game::import_state(&bytes).unwrap();

        msg!("New Frame: {:?}", new_game.game_state.frame);

        // Log for verification
        msg!("Game initialized successfully");

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

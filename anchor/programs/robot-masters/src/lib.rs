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
        // let mut characters = vec![gen_character(0), gen_character(1)];
        // let mut conditions = vec![
        //     cond_energy20().expect("Failed to create cond_energy20"),
        //     cond_leaning().expect("Failed to create cond_leaning"),
        //     cond_always().expect("Failed to create cond_always"),
        //     cond_rand20().expect("Failed to create cond_rand20"),
        // ];
        // let mut actions = vec![
        //     action_charge().expect("Failed to create action_charge"),
        //     action_turn().expect("Failed to create action_turn"),
        //     action_run().expect("Failed to create action_run"),
        //     action_jump().expect("Failed to create action_jump"),
        //     action_shoot(ShootArgs {
        //         energy_cost: 5,
        //         rate_of_fire: 2,
        //         reload_duration: 120,
        //         round_capacity: 5,
        //     })
        //     .expect("Failed to create action_shoot"),
        // ];
        // let mut spawns = vec![spawn_bullet().expect("Failed to create spawn_bullet")];

        // let mut builder = GameBuilder::new();
        // builder.reset();

        // // Register components
        // let _char1_id = builder.register_character(&characters[0]);
        // let _char2_id = builder.register_character(&characters[1]);

        // for condition in conditions.iter_mut() {
        //     let id = builder.register_condition(condition);
        //     condition.id = Some(id);
        // }

        // for action in actions.iter_mut() {
        //     let id = builder.register_action(action);
        //     action.id = Some(id);
        // }

        // let bullet_id = builder.register_spawn(&spawns[0]);
        // spawns[0].id = Some(bullet_id);

        // // Associate spawn with shoot action
        // actions[4].add_spawn(bullet_id);

        // // Configure character1
        // characters[0]
        //     .set_cpu(&[
        //         conditions[0].clone(),
        //         conditions[1].clone(),
        //         conditions[2].clone(),
        //         conditions[3].clone(),
        //     ])
        //     .expect("Failed to set CPU for character1");
        // characters[0]
        //     .attach_action(0, &actions[0])
        //     .expect("Failed to attach charge to character1");
        // characters[0]
        //     .attach_action(1, &actions[1])
        //     .expect("Failed to attach turn to character1");
        // characters[0]
        //     .attach_action(2, &actions[3])
        //     .expect("Failed to attach jump to character1");
        // characters[0]
        //     .attach_action(3, &actions[2])
        //     .expect("Failed to attach run to character1");

        // // Configure character2
        // characters[1]
        //     .set_cpu(&[
        //         conditions[0].clone(),
        //         conditions[1].clone(),
        //         conditions[2].clone(),
        //         conditions[3].clone(),
        //     ])
        //     .expect("Failed to set CPU for character2");
        // characters[1]
        //     .attach_action(0, &actions[0])
        //     .expect("Failed to attach charge to character2");
        // characters[1]
        //     .attach_action(1, &actions[1])
        //     .expect("Failed to attach turn to character2");
        // characters[1]
        //     .attach_action(2, &actions[4])
        //     .expect("Failed to attach shoot to character2");
        // characters[1]
        //     .attach_action(3, &actions[2])
        //     .expect("Failed to attach run to character2");

        // // Compose the game
        // let mut game = builder.compose(
        //     125,
        //     false,
        //     tile_map,
        //     (0, 1),
        //     &characters,
        //     &conditions,
        //     &actions,
        //     &spawns,
        // );

        let character_def = vec![
            vec![
                0, 0, 16, 196, 16, 28, 1, 100, 100, 1, 6, 30, 30, 100, 100, 100, 100, 100, 100,
                100, 100,
            ],
            vec![
                1, 1, 224, 196, 16, 28, 0, 100, 100, 1, 1, 30, 30, 100, 100, 100, 100, 100, 100,
                100, 100,
            ],
        ];

        let character_behaviors = vec![
            vec![(0, 0), (1, 1), (2, 2), (3, 3)],
            vec![(0, 0), (1, 1), (2, 4), (3, 3)],
        ];
        let spawn_def = vec![vec![
            1, 120, 12, 4, 10, 200, 1, 0, 4, 2, 5, 16, 0, 0, 0, 0, 19, 0, 124, 23, 1, 3, 1, 66, 2,
            0, 1, 20, 122, 2, 0, 1, 255, 8, 0, 112, 0, 1, 255, 0, 1,
        ]];

        let action_def = vec![
            vec![
                0, 0, 0, 0, 0, 0, 0, 19, 0, 45, 17, 0, 0, 0, 23, 0, 0, 0, 20, 27, 0, 19, 0, 35, 19,
                1, 36, 21, 3, 2, 34, 2, 0, 1, 71, 2, 2, 3, 17, 2, 97, 0, 0, 21, 4, 0, 21, 5, 3, 21,
                6, 1, 19, 7, 38, 19, 0, 47, 19, 1, 11, 32, 2, 0, 1, 71, 2, 2, 5, 17, 2, 96, 20, 13,
                4, 0, 1, 19, 0, 13, 74, 0, 0, 6, 20, 13, 0, 73, 2, 0, 7, 32, 2, 2, 4, 17, 2, 0, 1,
                19, 0, 35, 19, 1, 36, 19, 2, 37, 69, 0, 0, 2, 81, 0, 0, 1, 20, 35, 0, 0, 1,
            ],
            vec![
                2, 2, 0, 0, 0, 0, 0, 19, 0, 45, 17, 0, 0, 0, 1, 0, 19, 0, 31, 84, 0, 20, 31, 0, 98,
                0, 1,
            ],
            vec![
                3, 2, 0, 0, 0, 0, 0, 1, 0, 19, 0, 45, 17, 0, 0, 0, 19, 0, 41, 20, 28, 0, 98, 0, 1,
            ],
            vec![
                0, 0, 0, 0, 0, 0, 0, 19, 0, 31, 19, 1, 42, 66, 2, 0, 1, 20, 27, 2, 0, 1,
            ],
            vec![
                5, 2, 120, 0, 5, 0, 0, 19, 1, 14, 19, 3, 8, 21, 6, 3, 21, 7, 0, 32, 2, 1, 7, 71, 2,
                2, 6, 17, 2, 20, 13, 3, 20, 14, 7, 0, 1, 19, 0, 13, 21, 5, 1, 33, 2, 0, 7, 71, 2,
                2, 6, 17, 2, 20, 14, 5, 99, 0, 1, 70, 0, 0, 5, 20, 13, 0, 19, 4, 7, 128, 4, 0, 1,
            ],
        ];

        let condition_def = vec![
            vec![
                100, 100, 0, 0, 0, 0, 19, 0, 35, 21, 1, 20, 34, 2, 0, 1, 17, 2, 0, 0, 0, 1,
            ],
            vec![
                100, 100, 0, 0, 0, 0, 19, 0, 46, 19, 1, 44, 50, 2, 0, 1, 17, 2, 0, 0, 0, 1,
            ],
            vec![
                100, 100, 0, 0, 0, 0, 22, 0, 21, 1, 20, 34, 2, 0, 1, 17, 2, 0, 0, 0, 1,
            ],
            vec![100, 100, 0, 0, 0, 0, 0, 1],
        ];

        let mut game = Game::init(
            125,
            false,
            tile_map,
            (1, 2),
            character_def,
            character_behaviors,
            spawn_def,
            action_def,
            condition_def,
            vec![],
        );

        game.next_frame();
        game.next_frame();
        game.next_frame();
        game.next_frame();
        game.next_frame();
        game.next_frame();
        game.next_frame();
        game.next_frame();
        game.next_frame();
        game.next_frame();

        msg!(
            "frame {:?} pos.x {:?} seed {:?}",
            game.game_state.frame,
            game.characters[0].pos.0,
            game.game_state.seed
        );

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

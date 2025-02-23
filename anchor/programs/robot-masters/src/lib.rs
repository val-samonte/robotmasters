// use anchor_lang::prelude::*;

// use rmengine::{
//     components::{
//         Behavior, Behaviors, CharacterTag, CollisionSides, Direction, Energy, Group, Health,
//         Invulnerability, Position, PowerOutput, Protection, Size, Velocity, Weapon, Weapons,
//     },
//     fix16::Fix16,
//     game::GameState,
//     lcg::LCG,
//     World,
// };

// declare_id!("YUe8UbyQ88GmfjUpDE6TwoUbqwaj6qteWqd2VLWoVFm");

// #[program]
// pub mod robot_masters {

//     use super::*;

//     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
//         msg!("Greetings from: {:?}", ctx.program_id);

//         let game_state = GameState {
//             state: 0,
//             game_over_since: None,
//             winner: None,
//             frame: 0,
//             gravity: 50,
//             seed: 12345,
//             tile_map: vec![
//                 vec![1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//                 vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//                 vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//                 vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//                 vec![1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//                 vec![1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//                 vec![1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
//                 vec![1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
//                 vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
//                 vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
//                 vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
//                 vec![1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//                 vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//                 vec![1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
//                 vec![1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//             ],
//             to_spawn_projectiles: Vec::new(),
//             to_despawn_projectiles: Vec::new(),
//             to_damage: Vec::new(),
//         };

//         let mut world = World::new();

//         /*

//         world.spawn((
//             Group(0),
//             CharacterTag,
//             Position {
//                 x: Fix16::from_whole(32),
//                 y: Fix16::from_whole(192),
//             },
//             Velocity { x: 0, y: 0 },
//             Direction { x: true, y: true },
//             CollisionSides {
//                 top: false,
//                 right: false,
//                 bottom: false,
//                 left: false,
//             },
//             Size {
//                 width: Fix16::from_whole(16),
//                 height: Fix16::from_whole(32),
//             },
//             Health {
//                 health: 100,
//                 health_cap: 100,
//             },
//             Invulnerability {
//                 invul_until_frame: 0,
//                 base_invul_frame: 60,
//             },
//             Energy {
//                 base_energy_cap: 100,
//                 energy: 100,
//             },
//             PowerOutput {
//                 base_jump_force: -800,
//                 base_move_speed: 250,
//             },
//             Behaviors {
//                 locked_action: None,
//                 behaviors: vec![
//                     Behavior {
//                         condition: 4,
//                         action: 5,
//                         energy_cost: 0,
//                     },
//                     Behavior {
//                         condition: 2,
//                         action: 3,
//                         energy_cost: 6,
//                     },
//                     Behavior {
//                         condition: 8,
//                         action: 2,
//                         energy_cost: 3,
//                     },
//                     Behavior {
//                         condition: 7,
//                         action: 8,
//                         energy_cost: 0,
//                     },
//                     Behavior {
//                         condition: 8,
//                         action: 7,
//                         energy_cost: 0,
//                     },
//                     Behavior {
//                         condition: 1,
//                         action: 1,
//                         energy_cost: 1,
//                     },
//                     Behavior {
//                         condition: 10,
//                         action: 0,
//                         energy_cost: 0,
//                     },
//                 ],
//             },
//             Weapons {
//                 selected_weapon_index: 0,
//                 weapons: vec![Weapon {
//                     weapon_type: 1,
//                     projectile_id: Some(1),
//                     projectile_ejection_method: Some(1),
//                     energy_cost: 2,
//                     reload_energy_cost: Some(5),
//                     reload_cooldown: Some(120),
//                     ammo_cap: Some(5),
//                     ammo_count: Some(0),
//                     rate_of_fire: Some(15),
//                     output_pos_x: Some(0),
//                     output_pos_y: Some(12),
//                     output_count: Some(1),
//                     recoil: Some((0) * -1),
//                     require_grounded: false,
//                     counter: 0,
//                     reload_start_frame: None,
//                     last_attack_frame: None,
//                 }],
//             },
//             Protection::from_array([0, 0, 0, 0, 0, 0, 0, 0]),
//         ));

//         let prng = LCG::new(12345);
//          */
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct Initialize {}

use anchor_lang::prelude::*;
use rmengine::{
    components::{Group, Position, Velocity},
    fix16::Fix16,
    game::GameState,
    lcg::LCG,
    tinyecs::TinyECS as World,
};

declare_id!("YUe8UbyQ88GmfjUpDE6TwoUbqwaj6qteWqd2VLWoVFm");

#[program]
pub mod robot_masters {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Initializing robot-masters program");

        // Simplified game state
        let game_state = GameState {
            state: 0, // Demo mode
            game_over_since: None,
            winner: None,
            frame: 0,
            gravity: 50,
            seed: 12345,
            tile_map: vec![vec![1; 16]; 15], // Simple 15x16 map
            to_spawn_projectiles: Vec::new(),
            to_despawn_projectiles: Vec::new(),
            to_damage: Vec::new(),
        };

        // Initialize world and spawn an entity
        let mut world = World::new();
        let entity = world.spawn((
            Group(0),
            Position {
                x: Fix16::from_whole(32),
                y: Fix16::from_whole(192),
            },
            Velocity { x: 0, y: 0 },
        ));

        let _prng = LCG::new(game_state.seed);

        msg!("World initialized with entity {:?}", entity);
        msg!("Game state frame: {}", game_state.frame);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

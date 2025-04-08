use anchor_lang::prelude::*;

declare_id!("YUe8UbyQ88GmfjUpDE6TwoUbqwaj6qteWqd2VLWoVFm");

#[program]
pub mod robot_masters {
    use rmengine::structs::Game;

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Initializing robot-masters program");

        let mut game = Game::init(
            123,
            vec![
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
            ],
            (9, 10),
            vec![
                // characters
                vec![
                    0,   // id
                    0,   // group,
                    16,  // pos x
                    192, // pos y
                    16,  // width
                    32,  // height
                    1,   // dir, face right
                    100, // health
                    100, // energy / energy cap
                    1,   // energy regen
                    1,   // energy rate
                    1,   // power
                    1,   // weight
                    100, // punct
                    100, // blast
                    100, // force
                    100, // sever
                    100, // heat
                    100, // cryo
                    100, // jolt
                    100, // virus
                ],
            ],
            vec![
                // behaviors
                vec![
                    (0, 0), // always condition : shoot action
                ],
            ],
            vec![
                // spawn definitions
                vec![
                    // projectile 1
                    1,   // health
                    120, // duration
                    8,   // damage
                    1,   // element (punct)
                    1,   // destroy on collision
                    0,   // invul
                    6,   // width
                    2,   // height
                    8,   // output x
                    14,  // output y
                    0, 0, 0, 0, // extra args (4 in size)
                    0, 0, 0, // script (rest of the vec)
                ],
            ],
            vec![
                // action definitions
                vec![
                    // shoot projectile 1
                    2,  // energy cost
                    30, // interval (rate of fire)
                    0,  // duration (frames that keeps this action locked)
                    5,  // limit (ammo cap)
                    10, // refresh cost (reload energy cost)
                    60, // refresh duration (reload duration)
                    0, 0, 0, 0, // extra args (4 in size)
                    0, 0, 0, // script (rest of the vec, includes reference to projectile 1)
                ],
            ],
            vec![
                // condition definitions
                vec![
                    // always
                    1, // energy cost multiplier
                    0, 0, 0, 0, // extra args (4 in size)
                    0, 0, 0, // script (rest of the vec)
                ],
            ],
        );

        msg!("Frame: {:?}", game.frame);
        game.next_frame();

        let state = game.export_state();
        let bytes = state.unwrap();

        msg!("Game size: {:?}", bytes.len());

        let new_game = Game::import_state(&bytes).unwrap();

        msg!("New Frame: {:?}", new_game.frame);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

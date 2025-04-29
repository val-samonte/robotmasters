use crate::{Action, Character, Condition, Spawn};

pub fn gen_character(id: u8) -> Character {
    match id {
        0 => Character::new(0, 0, (16, 196), 16, 28, true, 100, 100, 1, 6, 30, 30, None),
        _ => Character::new(
            1,
            1,
            (224, 196),
            16,
            28,
            false,
            100,
            100,
            1,
            1,
            30,
            30,
            None,
        ),
    }
}

pub fn cond_energy20() -> Result<Condition, &'static str> {
    Condition::new(
        1,
        vec![],
        vec![
            0x13, 0x00, 0x23, // read energy to var0
            0x15, 0x01, 0x14, // assign 20 literal to var1
            0x22, 0x02, 0x00, 0x01, // var2 = var0 < var1
            0x11, 0x02, 0x00, 0x00, // exit if var2 == 0
            0x00, 0x01, // return 1
        ],
    )
}

pub fn cond_leaning() -> Result<Condition, &'static str> {
    Condition::new(
        1,
        vec![],
        vec![
            0x13, 0x00, 0x2e, // read left collision to var0
            0x13, 0x01, 0x2c, // read right collision to var1
            0x32, 0x02, 0x00, 0x01, // OR both var0 and var1 to var2
            0x11, 0x02, // skip next if var2 is 1
            0x00, 0x00, // return 0
            0x00, 0x01, // return 1
        ],
    )
}

pub fn cond_rand20() -> Result<Condition, &'static str> {
    Condition::new(
        1,
        vec![],
        vec![
            0x16, 0x00, // assign random byte to var0
            0x15, 0x01, 0x14, // assign 20 literal to var1
            0x22, 0x02, 0x00, 0x01, // var2 = var0 < var1
            0x11, 0x02, // skip next if var2 is 1
            0x00, 0x00, // return 0
            0x00, 0x01, // return 1
        ],
    )
}

pub fn cond_always() -> Result<Condition, &'static str> {
    Condition::new(1, vec![], vec![0x00, 0x01])
}

pub fn action_charge() -> Result<Action, &'static str> {
    Action::new(
        0,
        0,
        0,
        vec![],
        vec![
            0x13, 0x00, 0x2d, // var0 = is grounded
            0x11, 0x00, 0x00, 0x00, // if var0 not grounded, exit
            0x17, 0x00, 0x00, 0x00, // set fixed0 as 0.0
            0x14, 0x1b, 0x00, // set vel.x to fixed4
            0x13, 0x00, 0x23, // read energy to var0
            0x13, 0x01, 0x24, // read energy_cap to var1
            0x15, 0x03, 0x02, // assign 2 literal to var3
            0x22, 0x02, 0x00, 0x01, // var2 = var0 < var1
            0x47, 0x02, 0x02, 0x03, // var2 = var2 * var3 (2)
            0x11, 0x02, // if var2 == 0
            0x61, // unlock if needed
            0x00, 0x00, // exit 0
            // === else if low energy ===
            0x15, 0x04, 0x00, // assign 0 literal to var4
            0x15, 0x05, 0x03, // assign init skip count to var5 (3 operations)
            0x15, 0x06, 0x01, // assign counter amount (1) to var6
            0x13, 0x07, 0x26, // assign energy_rate to var7
            0x13, 0x00, 0x2f, // read 0x00 = locked_action
            0x13, 0x01, 0x0b, // read 0x01 = action_instance_id (this action)
            0x20, 0x02, 0x00, 0x01, // compare (var2 = var0 == var1)
            0x47, 0x02, 0x02, 0x05, // var2 = var2 * var5 (3)
            0x11, 0x02, // if var2 == 0
            // === if not locked yet === {
            0x60, // lock it
            0x14, 0x0d,
            0x04, // reset frame counter (action_instance.vars[0]) to 0 (from var4)
            0x00, 0x01, // exit 1 }
            // === else counter += 1 ===
            0x13, 0x00, 0x0d, // read vars[0] (counter)
            0x4a, 0x00, 0x00, 0x06, // add counter by 1 (var6)
            0x14, 0x0d, 0x00, // assign counter back to vars[0]
            0x49, 0x02, 0x00, 0x07, // modulo counter by energy_rate (var2 = 0x00 % 0x07)
            0x20, 0x02, 0x02,
            0x04, // var2 = var2 == var4 (0) this inverts var2 (if both 0, then var2 = 1)
            0x11, 0x02, // if var2 == 0
            0x00, 0x01, // exit 1
            // === else energy += energy_regen ===
            0x13, 0x00, 0x23, // read energy to var0 (again, refactor soon)
            0x13, 0x01, 0x24, // read energy_cap to var1 (again)
            0x13, 0x02, 0x25, // read energy regen to var2
            0x45, 0x00, 0x00, 0x02, // add energy regen to energy
            0x51, 0x00, 0x00, 0x01, // make sure to cap at energy_cap
            0x14, 0x23, 0x00, // assign energy back
            0x00, 0x01, // exit 1
        ],
    )
}

pub fn action_turn() -> Result<Action, &'static str> {
    Action::new(
        2,
        2,
        0,
        vec![],
        vec![
            0x13, 0x00, 0x2d, // var0 = is grounded
            0x11, 0x00, 0x00, 0x00, // if var0 not grounded, exit
            0x01, 0x00, // exit if no energy
            0x13, 0x00, 0x1f, // read dir to fixed0
            0x54, 0x00, // negate fixed0
            0x14, 0x1f, 0x00, // write dir back from fixed0
            0x62, // consume energy
            0x00, 0x01, // return 1
        ],
    )
}

pub fn action_run() -> Result<Action, &'static str> {
    Action::new(
        0,
        0,
        0,
        vec![],
        vec![
            0x13, 0x00, 0x1f, // read dir to fixed 0
            0x13, 0x01, 0x2a, // read move speed to fixed 1
            0x42, 0x02, 0x00, 0x01, // multiply dir to move speed, to fixed 2
            0x14, 0x1b, 0x02, // write product to vel.x
            0x00, 0x01, // exit with flag 1
        ],
    )
}

pub fn action_jump() -> Result<Action, &'static str> {
    Action::new(
        3,
        2,
        0,
        vec![],
        vec![
            0x01, 0x00, // exit if no energy
            0x13, 0x00, 0x2d, // var0 = is grounded
            0x11, 0x00, 0x00, 0x00, // if var0 not grounded, exit
            0x13, 0x00, 0x29, // read jump force to fixed0
            0x14, 0x1c, 0x00, // write jump force to vel.y
            0x62, // consume energy
            0x00, 0x01, // return 1
        ],
    )
}

#[derive(Clone, Copy)]
pub struct ShootArgs {
    pub energy_cost: u16,
    pub rate_of_fire: u16,
    pub reload_duration: u16,
    pub round_capacity: u16,
}

pub fn action_shoot(args: ShootArgs) -> Result<Action, &'static str> {
    Action::new(
        args.energy_cost,
        args.rate_of_fire,
        args.reload_duration,
        vec![None, Some(args.round_capacity)],
        vec![
            0x13, 0x01, 0x0e, // get refresh flag (vars[1])
            0x13, 0x03, 0x08, // get round capacity (args[1])
            0x15, 0x06, 0x03, // assign amount to skip to var6
            0x15, 0x07, 0x00, // assign 0 to var7
            0x20, 0x02, 0x01, 0x07, // var2 = refresh flag == 0
            0x47, 0x02, 0x02, 0x06, // var2 = var2 (0 OR 1) * skip count (var6); var2 = 0 OR 3
            0x11, 0x02, // skip 3 ops if refresh flag is 0
            // === if refresh flag is 1 ===
            0x14, 0x0d, 0x03, // set ammo to ammo cap
            0x14, 0x0e, 0x07, // remove refresh flag
            0x00, 0x01, // exit 1
            // === else ===
            0x13, 0x00, 0x0d, // get ammo (vars[0])
            0x15, 0x05, 0x01, // assign 1 literal to var5
            0x21, 0x02, 0x00, 0x07, // check if no ammo
            0x47, 0x02, 0x02, 0x06, // var2 = var2 (0 OR 1) * skip count (var6); var2 = 0 OR 3
            0x11, 0x02, // skip 3 ops if ammo > 0
            // === if ammo is 0 ===
            0x14, 0x0e, 0x05, // set refresh flag to 1
            0x63, // apply duration (reloading)
            0x00, 0x01, // exit
            // === else, shoot ===
            0x46, 0x00, 0x00, 0x05, // deduct 1 to ammo
            0x14, 0x0d, 0x00, // write ammo back
            0x13, 0x04, 0x07, // assign args[0] (projectile ID) to var4
            0x80, 0x04, // spawn projectile
            0x00, 0x01, // exit 1
        ],
    )
}

pub fn spawn_bullet() -> Result<Spawn, &'static str> {
    Spawn::new(
        1,
        120,
        12,
        4,
        10,
        200,
        1,
        false,
        4,
        2,
        (5, 16),
        vec![],
        vec![
            // === behavior script ===
            0x13, 0x00, 0x7c, // read dir to fixed0
            0x17, 0x01, 0x03, 0x01, // write 2.0 speed in fixed1
            0x42, 0x02, 0x00, 0x01, // multiply dir to move speed, to fixed 2
            0x14, 0x7a, 0x02, // write product to vel.x
            0x00, 0x01, // exit with flag 1
            // === collision script ===
            0xff, // delimeter
            0x08, 0x00, // exit if same group
            0x70, // apply damage
            0x00, 0x01, // exit 1
            // === despawn script ===
            0xff, // delimeter
            0x00, 0x01, // do nothing
        ],
    )
}

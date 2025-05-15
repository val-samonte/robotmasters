use bolt_lang::prelude::*;

#[account]
pub struct Character {
    pub bump: u8,
    pub owner: Pubkey,
    pub id: Pubkey, 
    pub name: [u8; 16],

    // body part IDs
    // TODO: consider the version IDs per each
    pub head: u32,
    pub body: u32,
    pub legs: u32,
    pub main: u32,

    // Fields reserved for future use (e.g., offhand and backpack item parts).
    pub offh: u32,
    pub back: u32,

    // game fields
    pub health_cap: u8,
    pub energy_cap: u8,
    pub energy_regen: u8,
    pub energy_rate: u16,
    pub power: u8,
    pub weight: u8,
    pub armor: [u8; 8],
    pub _reserve: [u8; 8],
    pub behaviors: Vec<[u32; 2]>, // CPU : Action pair

    // components associated to this character
    // allow duplicate values in this list
    // so that adding / removing is easy
    // TODO: consider the version IDs per each
    pub conditions: Vec<u32>,
    pub actions: Vec<u32>,
    pub spawns: Vec<u32>,
    pub effects: Vec<u32>,
}

impl Character {
    pub fn len(
        behavior_len: usize,
        conditions_len: usize,
        actions_len: usize,
        spawns_len: usize,
        effects_len: usize,
    ) -> usize {
        8 +  // account discriminator
        1 +  // bump
        32 + // owner
        32 +  // id
        16 + // name
        4 +  // head
        4 +  // body
        4 +  // legs
        4 +  // main
        4 +  // offh
        4 +  // back
        1 +  // health_cap
        1 +  // energy_cap
        1 +  // energy_regen
        1 +  // energy_rate
        1 +  // power
        1 +  // weight
        8 +  // armor
        8 +  // _reserve
        (4 + (8 * behavior_len)) +
        (4 + (4 * conditions_len)) + 
        (4 + (4 * actions_len)) + 
        (4 + (4 * spawns_len)) + 
        (4 + (4 * effects_len))
    }

    pub fn serialize(
        &self, 
        id: usize,
        pos_x: u16,
        pos_y: u16,
        width: u16,
        height: u16,
        face_right: bool,
    ) -> Vec<u16> {
        let output_len = 21;
        let mut output = Vec::with_capacity(output_len);
          
        output.push(id as u16); // character's game internal id
        output.push(id as u16); // group, we can reuse the id since its battle royale
        output.push(pos_x);
        output.push(pos_y);
        output.push(width);
        output.push(height);
        output.push((if face_right {1} else {0}) as u16);
        output.push(self.health_cap as u16);
        output.push(self.energy_cap as u16);
        output.push(self.energy_regen as u16);
        output.push(self.energy_rate);
        output.push(self.power as u16);
        output.push(self.weight as u16);
        output.push(self.armor[0] as u16);
        output.push(self.armor[1] as u16);
        output.push(self.armor[2] as u16);
        output.push(self.armor[3] as u16);
        output.push(self.armor[4] as u16);
        output.push(self.armor[5] as u16);
        output.push(self.armor[6] as u16);
        output.push(self.armor[7] as u16);

        output
    }
}

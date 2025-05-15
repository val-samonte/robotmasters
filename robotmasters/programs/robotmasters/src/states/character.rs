use bolt_lang::prelude::*;

#[account]
pub struct Character {
    pub bump: u8,
    pub owner: Pubkey,
    pub id: u32, // managed by character component_manager
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
        4 +  // id
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
}

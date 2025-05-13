use bolt_lang::prelude::*;

use super::ComponentState;

#[account]
pub struct ItemPart {
    pub bump: u8,
    pub state: ComponentState,
    pub id: u32,
    pub version: u32,
    pub item_type: ItemPartType,
    pub item_type_variation: u8, // for weapons (main / offhand)

    pub health: u8,
    pub weight: u8,
    pub power: u8,
    pub energy: u8,
    pub energy_regen: u8,
    pub energy_rate: u16,
    pub armor: [u8; 8],
    pub _reserve: [u8; 8], // reserve for future fields

    pub conditions: Vec<u32>,
    pub actions: Vec<u32>,
    pub spawns: Vec<u32>,
    pub effects: Vec<u32>,
}

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize)]
pub enum ItemPartType {
    Head,
    Body,
    Legs,
    Main,
    Offhand,
    Back,
}

impl ItemPartType {
    pub fn len(
        conditions_len: usize,
        actions_len: usize,
        spawns_len: usize,
        effects_len: usize,
    ) -> usize {
        8 + // Discriminator
        1 + // bump: u8
        1 + // state: ComponentState (simple enum)
        4 + // id: u32
        4 + // version: u32
        1 + // item_type: ItemPartType (enum)
        1 + // item_type_variation: u8
        1 + // health: u8
        1 + // weight: u8
        1 + // power: u8
        1 + // energy: u8
        1 + // energy_regen: u8
        2 + // energy_rate: u16
        8 + // armor: [u8; 8]
        8 + // reserve (8 bytes)
        (4 + (4 * conditions_len)) + // conditions: Vec<u32>
        (4 + (4 * actions_len)) + // actions: Vec<u32>
        (4 + (4 * spawns_len)) + // spawns: Vec<u32>
        (4 + (4 * effects_len)) // effects: Vec<u32>
    }
}

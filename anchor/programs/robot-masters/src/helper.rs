extern crate alloc;

use alloc::vec::Vec;
use rmengine::structs::{ActionId, ConditionId, Game};

#[derive(Clone)]
pub struct Character {
    pub id: u16,
    pub group: u16,
    pub pos: (u16, u16),
    pub width: u16,
    pub height: u16,
    pub is_facing_right: bool,
    pub health: u16,
    pub energy: u16,
    pub energy_regen: u16,
    pub energy_rate: u16,
    pub power: u16,
    pub weight: u16,
    pub armor: Vec<u16>,
    pub behaviors: Vec<(Condition, Option<Action>)>,
}

impl Character {
    pub fn new(
        id: u16,
        group: u16,
        pos: (u16, u16),
        width: u16,
        height: u16,
        is_facing_right: bool,
        health: u16,
        energy: u16,
        energy_regen: u16,
        energy_rate: u16,
        power: u16,
        weight: u16,
        armor: Option<Vec<u16>>,
    ) -> Self {
        Character {
            id,
            group,
            pos,
            width,
            height,
            is_facing_right,
            health,
            energy,
            energy_regen,
            energy_rate,
            power,
            weight,
            armor: armor.unwrap_or(vec![100; 8]),
            behaviors: Vec::new(),
        }
    }

    pub fn serialize(&self) -> Vec<u16> {
        let mut result = vec![
            self.id,
            self.group,
            self.pos.0,
            self.pos.1,
            self.width,
            self.height,
            if self.is_facing_right { 1 } else { 0 },
            self.health,
            self.energy,
            self.energy_regen,
            self.energy_rate,
            self.power,
            self.weight,
        ];
        result.extend(&self.armor);
        result
    }

    pub fn set_cpu(&mut self, conditions: &[Condition]) -> Result<(), &'static str> {
        if conditions.iter().any(|c| c.id.is_none()) {
            return Err("Not all conditions are registered yet");
        }
        self.behaviors = conditions.iter().map(|c| (c.clone(), None)).collect();
        Ok(())
    }

    pub fn attach_action(&mut self, slot: usize, action: &Action) -> Result<(), &'static str> {
        if action.id.is_none() {
            return Err("Cannot attach an unregistered Action");
        }
        if slot >= self.behaviors.len() {
            return Err("Slot is unavailable");
        }
        self.behaviors[slot].1 = Some(action.clone());
        Ok(())
    }
}

#[derive(Clone)]
pub struct Condition {
    pub id: Option<usize>,
    pub energy_mul: u16,
    pub args: Vec<Option<u16>>,
    pub script: Vec<u16>,
}

impl Condition {
    pub fn new(
        energy_mul: u16,
        args: Vec<Option<u16>>,
        script: Vec<u16>,
    ) -> Result<Self, &'static str> {
        if args.len() > 4 {
            return Err("Condition args must be exactly 4");
        }
        Ok(Condition {
            id: None,
            energy_mul,
            args,
            script,
        })
    }

    pub fn serialize(&self) -> Vec<u16> {
        let mut args: Vec<u16> = (0..4)
            .map(|i| self.args.get(i).and_then(|x| *x).unwrap_or(0))
            .collect();
        let mut result = vec![self.energy_mul * 100, 100];
        result.append(&mut args);
        result.extend(&self.script);
        result
    }
}

#[derive(Clone)]
pub struct Action {
    pub id: Option<usize>,
    pub energy_cost: u16,
    pub interval: u16,
    pub duration: u16,
    pub args: Vec<Option<u16>>,
    pub script: Vec<u16>,
    pub spawns: Vec<usize>,
}

impl Action {
    pub fn new(
        energy_cost: u16,
        interval: u16,
        duration: u16,
        args: Vec<Option<u16>>,
        script: Vec<u16>,
    ) -> Result<Self, &'static str> {
        if args.len() > 4 {
            return Err("Action args must be exactly 4");
        }
        Ok(Action {
            id: None,
            energy_cost,
            interval,
            duration,
            args,
            script,
            spawns: Vec::new(),
        })
    }

    pub fn add_spawn(&mut self, id: usize) {
        self.spawns.push(id);
    }

    pub fn serialize(&self) -> Vec<u16> {
        let mut args: Vec<Option<u16>> =
            (0..4).map(|i| self.args.get(i).and_then(|x| *x)).collect();
        for &spawn in &self.spawns {
            for i in 0..4 {
                if args[i].is_none() {
                    args[i] = Some(spawn as u16);
                    break;
                }
            }
        }
        let args: Vec<u16> = args.into_iter().map(|x| x.unwrap_or(0)).collect();
        let mut result = vec![self.energy_cost, self.interval, self.duration];
        result.extend(args);
        result.extend(&self.script);
        result
    }
}

#[derive(Clone)]
pub struct Spawn {
    pub id: Option<usize>,
    pub health: u16,
    pub duration: u16,
    pub damage_base: u16,
    pub damage_range: u16,
    pub crit_chance: u16,
    pub crit_multiplier: u16,
    pub element: u16,
    pub destroy_on_collision: bool,
    pub width: u16,
    pub height: u16,
    pub output_pos: (u16, u16),
    pub args: Vec<Option<u16>>,
    pub script: Vec<u16>,
    pub spawns: Vec<usize>,
}

impl Spawn {
    pub fn new(
        health: u16,
        duration: u16,
        damage_base: u16,
        damage_range: u16,
        crit_chance: u16,
        crit_multiplier: u16,
        element: u16,
        destroy_on_collision: bool,
        width: u16,
        height: u16,
        output_pos: (u16, u16),
        args: Vec<Option<u16>>,
        script: Vec<u16>,
    ) -> Result<Self, &'static str> {
        if args.len() > 4 {
            return Err("Spawn args must be exactly 4");
        }
        Ok(Spawn {
            id: None,
            health,
            duration,
            damage_base,
            damage_range,
            crit_chance,
            crit_multiplier,
            element,
            destroy_on_collision,
            width,
            height,
            output_pos,
            args,
            script,
            spawns: Vec::new(),
        })
    }

    pub fn add_spawn(&mut self, id: usize) {
        self.spawns.push(id);
    }

    pub fn serialize(&self) -> Vec<u16> {
        let mut args: Vec<Option<u16>> =
            (0..4).map(|i| self.args.get(i).and_then(|x| *x)).collect();
        for &spawn in &self.spawns {
            for i in 0..4 {
                if args[i].is_none() {
                    args[i] = Some(spawn as u16);
                    break;
                }
            }
        }
        let args: Vec<u16> = args.into_iter().map(|x| x.unwrap_or(0)).collect();
        let mut result = vec![
            self.health,
            self.duration,
            self.damage_base,
            self.damage_range,
            self.crit_chance,
            self.crit_multiplier,
            self.element,
            if self.destroy_on_collision { 1 } else { 0 },
            self.width,
            self.height,
            self.output_pos.0,
            self.output_pos.1,
        ];
        result.extend(args);
        result.extend(&self.script);
        result
    }
}

pub struct GameBuilder {
    character_ids: Vec<usize>,
    condition_ids: Vec<usize>,
    action_ids: Vec<usize>,
    spawn_ids: Vec<usize>,
}

impl GameBuilder {
    pub fn new() -> Self {
        GameBuilder {
            character_ids: Vec::new(),
            condition_ids: Vec::new(),
            action_ids: Vec::new(),
            spawn_ids: Vec::new(),
        }
    }

    pub fn reset(&mut self) {
        self.character_ids.clear();
        self.condition_ids.clear();
        self.action_ids.clear();
        self.spawn_ids.clear();
    }

    pub fn register_character(&mut self, character: &Character) -> usize {
        let id = character.id as usize;
        if !self.character_ids.contains(&id) {
            self.character_ids.push(id);
        }
        id
    }

    pub fn register_condition(&mut self, condition: &Condition) -> usize {
        if let Some(id) = condition.id {
            if self.condition_ids.contains(&id) {
                return id;
            }
        }
        let id = self.condition_ids.len();
        if !self.condition_ids.contains(&id) {
            self.condition_ids.push(id);
        }
        id
    }

    pub fn register_action(&mut self, action: &Action) -> usize {
        if let Some(id) = action.id {
            if self.action_ids.contains(&id) {
                return id;
            }
        }
        let id = self.action_ids.len();
        if !self.action_ids.contains(&id) {
            self.action_ids.push(id);
        }
        id
    }

    pub fn register_spawn(&mut self, spawn: &Spawn) -> usize {
        if let Some(id) = spawn.id {
            if self.spawn_ids.contains(&id) {
                return id;
            }
        }
        let id = self.spawn_ids.len();
        if !self.spawn_ids.contains(&id) {
            self.spawn_ids.push(id);
        }
        id
    }

    pub fn compose(
        &self,
        seed: u16,
        is_demo: bool,
        tile_map: Vec<Vec<u8>>,
        gravity: (i32, i32),
        characters: &[Character],
        conditions: &[Condition],
        actions: &[Action],
        spawns: &[Spawn],
    ) -> Game {
        let character_def: Vec<Vec<u16>> = self
            .character_ids
            .iter()
            .filter_map(|&id| characters.get(id).map(|c| c.serialize()))
            .collect();

        let character_behaviors: Vec<Vec<(ConditionId, ActionId)>> = self
            .character_ids
            .iter()
            .filter_map(|&id| {
                characters.get(id).map(|c| {
                    c.behaviors
                        .iter()
                        .filter(|(_, a)| a.is_some())
                        .map(|(c, a)| (c.id.unwrap(), a.as_ref().unwrap().id.unwrap()))
                        .collect()
                })
            })
            .collect();

        let spawn_def: Vec<Vec<u16>> = self
            .spawn_ids
            .iter()
            .filter_map(|&id| spawns.get(id).map(|s| s.serialize()))
            .collect();

        let action_def: Vec<Vec<u16>> = self
            .action_ids
            .iter()
            .filter_map(|&id| actions.get(id).map(|a| a.serialize()))
            .collect();

        let condition_def: Vec<Vec<u16>> = self
            .condition_ids
            .iter()
            .filter_map(|&id| conditions.get(id).map(|c| c.serialize()))
            .collect();

        let status_effect_def: Vec<Vec<u16>> = Vec::new();

        Game::init(
            seed,
            is_demo,
            tile_map,
            gravity,
            character_def,
            character_behaviors,
            spawn_def,
            action_def,
            condition_def,
            status_effect_def,
        )
    }
}

use bolt_lang::*;

extern crate alloc;
use alloc::collections::BTreeSet;
use rmengine::structs::{ActionId, ConditionId, Game};

use crate::{tile_map, Action, Character, CharacterMatch, CharacterMatchState, Condition, FromAccountInfo, GameState, GameStateState, Spawn};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateGameArgs {
    conditions: Vec<u32>,
    actions: Vec<u32>,
    spawns: Vec<u32>,
}

#[derive(Accounts)]
#[instruction(args: CreateGameArgs)]
pub struct CreateGame<'info> {

    #[account(
        init,
        payer = owner,
        seeds = [
            b"game_state",
            id.key().as_ref(),
        ],
        bump,
        space = GameState::len()
    )]
    pub game_state: Box<Account<'info, GameState>>,

    #[account(
        has_one = owner @ CreateGameError::Unauthorized,
    )]
    pub raider: Box<Account<'info, Character>>,

    #[account(
        mut,
        constraint = raider.key() == raider_match.character.key(),
        constraint = raider_match.state != CharacterMatchState::Rest && 
            raider_match.state != CharacterMatchState::Raider
    )]
    pub raider_match: Box<Account<'info, CharacterMatch>>,

    #[account(
        constraint = defender.owner != Pubkey::default() @ CreateGameError::InvalidDefender,
        constraint = defender.to_account_info().owner == &crate::ID @ CreateGameError::InvalidAccountOwner
    )]
    pub defender: Box<Account<'info, Character>>,

    #[account(
        mut,
        constraint = defender.key() == defender_match.character.key(),
        constraint = defender_match.state != CharacterMatchState::Rest
    )]
    pub defender_match: Box<Account<'info, CharacterMatch>>,

    pub id: Signer<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create_game_handler(
    ctx: Context<CreateGame>,
    args: CreateGameArgs,
) -> Result<()> {

    let game_state = &mut ctx.accounts.game_state;
    let raider = &ctx.accounts.raider;
    let raider_match = &mut ctx.accounts.raider_match;
    let defender = &ctx.accounts.defender;
    let defender_match = &mut ctx.accounts.defender_match;

    game_state.bump = ctx.bumps.game_state;
    game_state.state = GameStateState::Pending;
    game_state.raider = raider.key();
    game_state.raider_elo = raider_match.elo;
    game_state.defender = defender.key();
    game_state.defender_elo = defender_match.elo;
    game_state.elo_changes = compute_elo_changes(game_state.raider_elo, game_state.defender_elo);
    // game_state.data = Box::new([0u8; 3600]);

    raider_match.state = CharacterMatchState::Raider;
    defender_match.state = if defender_match.state == CharacterMatchState::Deployed {
        CharacterMatchState::Defender
    } else {
        defender_match.state
    };

    // verify mappings from args if either ids are indeed included
    // from raider / defender
    if !verify_combined_unique(
        &raider.conditions, &defender.conditions, &args.conditions
    ) || !verify_combined_unique(
        &raider.actions, &defender.actions, &args.actions
    ) || !verify_combined_unique(
        &raider.spawns, &defender.spawns, &args.spawns
    ) {
        return Err(CreateGameError::InvalidArgs.into());
    }

    // from here, we can rely for the args as indices for the components

    let mut condition_accounts: Vec<Option<Condition>> = vec![None; args.conditions.len()];
    let mut action_accounts: Vec<Option<Action>> = vec![None; args.actions.len()];
    let mut spawn_accounts: Vec<Option<Spawn>> = vec![None; args.spawns.len()];

    let cond_disc = get_discriminator("Condition");
    let action_disc = get_discriminator("Action");
    let spawn_disc = get_discriminator("Spawn");

    for account_info in ctx.remaining_accounts {
        if account_info.owner != &crate::ID {
            return Err(CreateGameError::InvalidAccountOwner.into());
        }
        let data = account_info.data.borrow();
        if data.len() < 8 {
            continue;
        }
        
        if check_discriminator(account_info, cond_disc) {
            let condition = Condition::from_account_info(account_info)?;
            if let Some(index) = args.conditions.iter().position(|&id| id == condition.id) {
                condition_accounts[index] = Some(condition);
            }
        } else if check_discriminator(account_info, action_disc) {
            let action = Action::from_account_info(account_info)?;
            if let Some(index) = args.actions.iter().position(|&id| id == action.id) {
                action_accounts[index] = Some(action);
            }
        } else if check_discriminator(account_info, spawn_disc) {
            let spawn = Spawn::from_account_info(account_info)?;
            if let Some(index) = args.spawns.iter().position(|&id| id == spawn.id) {
                spawn_accounts[index] = Some(spawn);
            }
        }
    }

    // verify if all accounts are present

    for i in 0..args.conditions.len() {
        if condition_accounts[i].is_none() {
            // msg!("Missing Condition for ID: {}", id);
            return Err(CreateGameError::MissingAccount.into());
        }
    }
    for i in 0..args.actions.len() {
        if action_accounts[i].is_none() {
            // msg!("Missing Action for ID: {}", id);
            return Err(CreateGameError::MissingAccount.into());
        }
    }
    for i in 0..args.spawns.len() {
        if spawn_accounts[i].is_none() {
            // msg!("Missing Spawn for ID: {}", id);
            return Err(CreateGameError::MissingAccount.into());
        }
    }

    // TODO: dynamic maps and positioning

    let character_def = vec![
        raider.serialize(0, 16, 192, 16, 32, true),
        defender.serialize(1, 224, 192, 16, 32, false)
    ];

    let mut character_behaviors: Vec<Vec<(ConditionId, ActionId)>> = vec![
        vec![(0, 0); raider.behaviors.len()], // Initialize for raider
        vec![(0, 0); defender.behaviors.len()] // Initialize for defender
    ];

    // raider behaviors
    for (i, [cond, act]) in raider.behaviors.iter().enumerate() {
        if !args.conditions.contains(cond) || !args.actions.contains(act) {
            return Err(CreateGameError::InvalidArgs.into());
        }
        character_behaviors[0][i] = (
            args.conditions.iter().position(|&id| id == *cond).unwrap(),
            args.actions.iter().position(|&id| id == *act).unwrap()
        );
    }

    // defender behaviors
    for (i, [cond, act]) in defender.behaviors.iter().enumerate() {
        if !args.conditions.contains(cond) || !args.actions.contains(act) {
            return Err(CreateGameError::InvalidArgs.into());
        }
        character_behaviors[1][i] = (
            args.conditions.iter().position(|&id| id == *cond).unwrap(),
            args.actions.iter().position(|&id| id == *act).unwrap()
        );
    }

    let mut cond_def: Vec<Vec<u16>> = vec![];

    for cond in condition_accounts.iter() {
        if let Some(cond) = cond {
            cond_def.push(cond.serialize());
        }
    }

    let mut action_def: Vec<Vec<u16>> = vec![];
    for action in action_accounts.iter() {
        if let Some(action) = action {
            let mut action_args = action.args;
            let none_indices: Vec<usize> = action_args
                .iter()
                .enumerate()
                .filter(|&(_, opt)| opt.is_none())
                .map(|(i, _)| i)
                .collect();
            for (i, spawn_id) in action.spawns.iter().enumerate() {
                if i >= none_indices.len() {
                    break;
                }
                if !args.spawns.contains(spawn_id) {
                    return Err(CreateGameError::InvalidArgs.into());
                }
                action_args[none_indices[i]] = Some(*spawn_id as u8);
            }
            action_def.push(action.serialize(action_args));
        }
    }

    let mut spawn_def: Vec<Vec<u16>> = vec![];
    for spawn in spawn_accounts.iter() {
        if let Some(spawn) = spawn {
            let mut spawn_args = spawn.args;
            let none_indices: Vec<usize> = spawn_args
                .iter()
                .enumerate()
                .filter(|&(_, opt)| opt.is_none())
                .map(|(i, _)| i)
                .collect();
            for (i, spawn_id) in spawn.spawns.iter().enumerate() {
                if i >= none_indices.len() {
                    break;
                }
                if !args.spawns.contains(spawn_id) {
                    return Err(CreateGameError::InvalidArgs.into());
                }
                spawn_args[none_indices[i]] = Some(*spawn_id as u8);
            }
            spawn_def.push(spawn.serialize(spawn_args));
        }
    }

    // seed 
    let clock = Clock::get()?;
    let unix_timestamp = clock.unix_timestamp; // i64
    let timestamp_bytes = unix_timestamp.to_le_bytes(); // [u8; 8]
    let seed = u16::from_le_bytes([timestamp_bytes[0], timestamp_bytes[1]]);

    let game = Game::init(
		seed,
		false,
		tile_map(),
		(1, 2),
		character_def,
		character_behaviors,
		spawn_def,
		action_def,
		cond_def,
		vec![],
	);

    let state = game.export_state().unwrap();
	let len = state.len();
	if len > 3600 {
        return Err(CreateGameError::DataTooLarge.into());
    }

    game_state.len = len as u16;
	game_state.frame = game.game_state.frame;
    game_state.data = state.into();

    Ok(())
}

#[error_code]
pub enum CreateGameError {
    #[msg("Unauthorized: Signer does not own the character")]
    Unauthorized,
    #[msg("Invalid account owner")]
    InvalidAccountOwner,
    #[msg("Invalid defender account")]
    InvalidDefender,
    #[msg("There are inconsistencies with the expected args against characters components.")]
    InvalidArgs,
    #[msg("There are missing accounts required.")]
    MissingAccount,
    #[msg("Game state data is too large to store")]
    DataTooLarge,
}

pub fn compute_elo_changes(elo_a: u16, elo_b: u16) -> [i8; 3] {
    const K: i32 = 32; // K-factor for rating adjustment
    const SCALE: i32 = 1000; // Higher scaling factor for precision

    // Calculate rating difference
    let diff = elo_b as i32 - elo_a as i32;

    // Approximate expected score for Player A
    let expected_a = if diff.abs() > 400 {
        if diff > 0 { SCALE / 10 } else { SCALE * 9 / 10 }
    } else {
        SCALE - (diff * SCALE / 400)
    };

    let win_a = ((K * (SCALE - expected_a) + SCALE / 2) / SCALE)
        .clamp(i8::MIN as i32, i8::MAX as i32) as i8;
    let draw_a = ((K * (SCALE / 2 - expected_a) + SCALE / 2) / SCALE)
        .clamp(i8::MIN as i32, i8::MAX as i32) as i8;
    let loss_a = ((K * (0 - expected_a) + SCALE / 2) / SCALE)
        .clamp(i8::MIN as i32, i8::MAX as i32) as i8;

    [win_a, draw_a, loss_a]
}


pub fn verify_combined_unique(vec_a: &Vec<u32>, vec_b: &Vec<u32>, expected: &Vec<u32>) -> bool {
    let mut unique = BTreeSet::new();
    for &x in vec_a {
        unique.insert(x);
    }
    for &x in vec_b {
        unique.insert(x);
    }
    let mut expected_set = BTreeSet::new();
    for &x in expected {
        if expected_set.insert(x) {
            return false;
        }
    }
    unique != expected_set
}

pub fn get_discriminator(account_name: &str) -> [u8; 8] {
    let prefixed = alloc::format!("account:{}", account_name);
    let hash: solana_program::hash::Hash = solana_program::hash::hash(prefixed.as_bytes());
    let bytes = hash.to_bytes();
    let mut disc = [0u8; 8];
    disc.copy_from_slice(&bytes[..8]);
    disc
}

pub fn check_discriminator(account_info: &AccountInfo, expected_disc: [u8; 8]) -> bool {
    let data = account_info.data.borrow();
    if data.len() < 8 {
        return false;
    }
    data[..8] == expected_disc
}


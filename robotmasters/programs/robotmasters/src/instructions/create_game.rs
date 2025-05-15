// set match states
// load character details

use bolt_lang::*;

extern crate alloc;
use alloc::collections::BTreeSet;

use crate::{Action, Character, CharacterMatch, CharacterMatchState, Condition, FromAccountInfo, GameState, GameStateState, Spawn};

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
        mut,
        has_one = owner,
    )]
    pub raider: Box<Account<'info, Character>>,

    #[account(
        mut,
        constraint = raider.key() == raider_match.character.key(),
        constraint = raider_match.state != CharacterMatchState::Rest && 
            raider_match.state != CharacterMatchState::Raider
    )]
    pub raider_match: Box<Account<'info, CharacterMatch>>,

    #[account(mut)]
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
    let raider = &mut ctx.accounts.raider;
    let raider_match = &mut ctx.accounts.raider_match;
    let defender = &mut ctx.accounts.defender;
    let defender_match = &mut ctx.accounts.defender_match;

    game_state.bump = ctx.bumps.game_state;
    game_state.state = GameStateState::Pending;
    game_state.raider = raider.key();
    game_state.raider_elo = raider_match.elo;
    game_state.defender = defender.key();
    game_state.defender_elo = defender_match.elo;
    game_state.elo_changes = compute_elo_changes(game_state.raider_elo, game_state.defender_elo);
    game_state.frame = 0;
    game_state.len = 0;
    game_state.frame = 0;
    game_state.data = Box::new([0u8; 3600]);

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

    // process behaviors (replace id)

    // process spawns
    

    // seed 
    // let clock = Clock::get()?;

    Ok(())
}

#[error_code]
pub enum CreateGameError {
    #[msg("There are inconsistencies with the expected args against characters components.")]
    InvalidArgs,
    #[msg("There are missing accounts required.")]
    MissingAccount,
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

    // Calculate rating changes for Player A
    let win_a = ((K * (SCALE - expected_a) + SCALE / 2) / SCALE) as i8;
    let draw_a = ((K * (SCALE / 2 - expected_a) + SCALE / 2) / SCALE) as i8;
    let loss_a = ((K * (0 - expected_a) + SCALE / 2) / SCALE) as i8;

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


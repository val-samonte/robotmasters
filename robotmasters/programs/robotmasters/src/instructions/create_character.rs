use bolt_lang::*;

use crate::{
    Character, CharacterMatch, CharacterMatchState, ComponentControl, ComponentState, ItemPart,
    CHARACTER_MATCH_SEED, CHARACTER_SEED, ITEM_PART_CONTROL_SEED, ITEM_PART_SEED,
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCharacterArgs {
    name: String,
    head: u32,
    body: u32,
    legs: u32,
    main: u32,
    behaviors: Vec<Vec<u32>>,
    conditions_len: usize,
    actions_len: usize,
    spawns_len: usize,
    effects_len: usize,
}

#[derive(Accounts)]
#[instruction(args: CreateCharacterArgs)]
pub struct CreateCharacter<'info> {
    #[account(
		init,
		payer = authority,
		seeds = [
			CHARACTER_SEED,
			id.key().as_ref(),
		],
		bump,
		space = Character::len(
            args.behaviors.len(),
            args.conditions_len,
            args.actions_len,
            args.spawns_len,
            args.effects_len,
        )
	)]
    pub character: Box<Account<'info, Character>>,

    #[account(
		init,
		payer = authority,
		seeds = [
			CHARACTER_MATCH_SEED,
		],
		bump,
		space = CharacterMatch::len()
	)]
    pub character_match: Box<Account<'info, CharacterMatch>>,

    #[account(
        seeds = [
			ITEM_PART_SEED,
			&args.head.to_le_bytes()[..],
            &head_control.active.to_be_bytes()[..],
		],
        bump = head_part.bump
    )]
    pub head_part: Box<Account<'info, ItemPart>>,

    #[account(
        seeds = [
			ITEM_PART_CONTROL_SEED,
			&args.head.to_le_bytes()[..],
		],
        bump = head_control.bump
    )]
    pub head_control: Box<Account<'info, ComponentControl>>,

    #[account(
        seeds = [
			ITEM_PART_SEED,
			&args.body.to_le_bytes()[..],
            &body_control.active.to_be_bytes()[..],
		],
        bump = body_part.bump
    )]
    pub body_part: Box<Account<'info, ItemPart>>,

    #[account(
        seeds = [
			ITEM_PART_CONTROL_SEED,
			&args.body.to_le_bytes()[..],
		],
        bump = body_control.bump
    )]
    pub body_control: Box<Account<'info, ComponentControl>>,

    #[account(
        seeds = [
			ITEM_PART_SEED,
			&args.legs.to_le_bytes()[..],
            &legs_control.active.to_be_bytes()[..],
		],
        bump = legs_part.bump
    )]
    pub legs_part: Box<Account<'info, ItemPart>>,

    #[account(
        seeds = [
			ITEM_PART_CONTROL_SEED,
			&args.legs.to_le_bytes()[..],
		],
        bump = legs_control.bump
    )]
    pub legs_control: Box<Account<'info, ComponentControl>>,

    #[account(
        seeds = [
			ITEM_PART_SEED,
			&args.main.to_le_bytes()[..],
            &main_control.active.to_be_bytes()[..],
		],
        bump = main_part.bump
    )]
    pub main_part: Box<Account<'info, ItemPart>>,

    #[account(
        seeds = [
			ITEM_PART_CONTROL_SEED,
			&args.main.to_le_bytes()[..],
		],
        bump = main_control.bump
    )]
    pub main_control: Box<Account<'info, ComponentControl>>,

    pub id: Signer<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create_character_handler(
    ctx: Context<CreateCharacter>,
    args: CreateCharacterArgs,
) -> Result<()> {
    let character = &mut ctx.accounts.character;
    let character_match = &mut ctx.accounts.character_match;
    let head = &ctx.accounts.head_part;
    let body = &ctx.accounts.body_part;
    let legs = &ctx.accounts.legs_part;
    let main = &ctx.accounts.main_part;

    let head_control = &ctx.accounts.head_control;
    let body_control = &ctx.accounts.body_control;
    let legs_control = &ctx.accounts.legs_control;
    let main_control = &ctx.accounts.main_control;

    if head.state != ComponentState::Published
        || body.state != ComponentState::Published
        || legs.state != ComponentState::Published
        || main.state != ComponentState::Published
    {
        return Err(CreateCharacterError::InvalidPartState.into());
    }

    if head.item_tier != 0 || body.item_tier != 0 || legs.item_tier != 0 || main.item_tier != 0 {
        return Err(CreateCharacterError::InvalidTier.into());
    }

    if head_control.active != head.id
        || body_control.active != body.id
        || legs_control.active != legs.id
        || main_control.active != main.id
    {
        return Err(CreateCharacterError::InvalidControlActive.into());
    }

    let total_conditions_len = head.conditions.len()
        + body.conditions.len()
        + legs.conditions.len()
        + main.conditions.len();
    let total_actions_len =
        head.actions.len() + body.actions.len() + legs.actions.len() + main.actions.len();
    let total_spawns_len =
        head.spawns.len() + body.spawns.len() + legs.spawns.len() + main.spawns.len();
    let total_effects_len =
        head.effects.len() + body.effects.len() + legs.effects.len() + main.effects.len();

    if total_conditions_len != args.conditions_len
        || total_actions_len != args.actions_len
        || total_spawns_len != args.spawns_len
        || total_effects_len != args.effects_len
    {
        return Err(CreateCharacterError::InvalidVectorLengths.into());
    }

    character_match.bump = ctx.bumps.character_match;
    character_match.active_matches = 0;
    character_match.character = character.key();
    character_match.elo = 1200;
    character_match.elo_seg = 12;
    character_match.elo_sub = 0;
    character_match.state = CharacterMatchState::Rest;

    character.bump = ctx.bumps.character;
    character.owner = ctx.accounts.authority.key();
    character.id = ctx.accounts.id.key();

    if args.name.as_bytes().len() > 16 {
        return Err(CreateCharacterError::NameTooLong.into());
    }

    character.name = [0u8; 16];
    let bytes = args.name.as_bytes();
    character.name[..bytes.len()].copy_from_slice(bytes);

    character.health_cap = 0;
    character.energy_cap = 0;
    character.energy_regen = 0;
    character.energy_rate = 0;
    character.power = 0;
    character.weight = 0;
    character.armor = [100u8; 8];

    character.head = args.head;
    character.body = args.body;
    character.legs = args.legs;
    character.main = args.main;

    // head
    character.health_cap = character.health_cap.saturating_add(head.health);
    character.weight = character.weight.saturating_add(head.weight);
    character.armor = apply_armor(character.armor, head.armor);

    // behavior sequence should match conditions ID
    character.behaviors = vec![];

    if args.behaviors.len() != head.conditions.len() {
        return Err(CreateCharacterError::InvalidBehavior.into());
    }
    for i in 0..args.behaviors.len() {
        if args.behaviors[i][0] != head.conditions[i] {
            return Err(CreateCharacterError::InvalidBehavior.into());
        }
        if args.behaviors[i].len() == 2 {
            character
                .behaviors
                .push([args.behaviors[i][0], args.behaviors[i][1]]);
        }
    }

    character.conditions.extend_from_slice(&head.conditions);
    character.actions.extend_from_slice(&head.actions);
    character.spawns.extend_from_slice(&head.spawns);
    character.effects.extend_from_slice(&head.effects);

    // body
    character.health_cap = character.health_cap.saturating_add(body.health);
    character.weight = character.weight.saturating_add(body.weight);
    character.power = character.power.saturating_add(body.power);
    character.energy_cap = character.energy_cap.saturating_add(body.energy);
    character.energy_rate = character.energy_rate.saturating_add(body.energy_rate);
    character.energy_regen = character.energy_regen.saturating_add(body.energy_regen);
    character.armor = apply_armor(character.armor, body.armor);
    character.conditions.extend_from_slice(&body.conditions);
    character.actions.extend_from_slice(&body.actions);
    character.spawns.extend_from_slice(&body.spawns);
    character.effects.extend_from_slice(&body.effects);

    // legs
    character.health_cap = character.health_cap.saturating_add(legs.health);
    character.weight = character.weight.saturating_add(legs.weight);
    character.armor = apply_armor(character.armor, legs.armor);
    character.conditions.extend_from_slice(&legs.conditions);
    character.actions.extend_from_slice(&legs.actions);
    character.spawns.extend_from_slice(&legs.spawns);
    character.effects.extend_from_slice(&legs.effects);

    // main weapon
    character.weight = character.weight.saturating_add(main.weight);
    character.conditions.extend_from_slice(&main.conditions);
    character.actions.extend_from_slice(&main.actions);
    character.spawns.extend_from_slice(&main.spawns);
    character.effects.extend_from_slice(&main.effects);

    Ok(())
}

#[error_code]
pub enum CreateCharacterError {
    #[msg("Behaviors CPU list does not match with the head part.")]
    InvalidBehavior,
    #[msg("Character name exceeds 16 bytes.")]
    NameTooLong,
    #[msg("One or more item parts are not in the Published state.")]
    InvalidPartState,
    #[msg("Only Tier 0 items can be equipped on creation.")]
    InvalidTier,
    #[msg("ComponentControl active field does not match ItemPart ID.")]
    InvalidControlActive,
    #[msg("Provided vector lengths do not match the sum of part vectors.")]
    InvalidVectorLengths,
}

// Applies additional armor values, where `add[i]` is offset by 100 (neutral point).
// Ensures the result stays within u8 bounds, clamping negative values to 0.
fn apply_armor(current: [u8; 8], add: [u8; 8]) -> [u8; 8] {
    let mut result = [0u8; 8];
    for i in 0..8 {
        result[i] = (current[i] as i8).saturating_add((add[i] as i8).saturating_sub(100)) as u8;
    }
    result
}

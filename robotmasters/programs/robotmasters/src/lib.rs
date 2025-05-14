use bolt_lang::prelude::*;
use ephemeral_rollups_sdk::anchor::ephemeral;

pub mod example;
pub mod instructions;
pub mod states;

pub use example::*;
pub use instructions::*;
pub use states::*;

declare_id!("BSi1fEa8drVMVNTRhYV3fga467x9Rt5YteMEUHbebxLP");

#[ephemeral]
#[program]
pub mod robotmasters {

    use super::*;

    pub fn init(ctx: Context<Init>, args: InitArgs) -> Result<()> {
        init_handler(ctx, args)
    }

    pub fn create_cond(ctx: Context<CreateCondition>, args: CreateConditionArgs) -> Result<()> {
        create_cond_handler(ctx, args)
    }

    pub fn update_cond(ctx: Context<UpdateCondition>, args: UpdateConditionArgs) -> Result<()> {
        update_cond_handler(ctx, args)
    }

    pub fn version_cond(ctx: Context<VersionCondition>, args: VersionConditionArgs) -> Result<()> {
        version_cond_handler(ctx, args)
    }

    pub fn create_action(ctx: Context<CreateAction>, args: CreateActionArgs) -> Result<()> {
        create_action_handler(ctx, args)
    }

    pub fn update_action(ctx: Context<UpdateAction>, args: UpdateActionArgs) -> Result<()> {
        update_action_handler(ctx, args)
    }

    pub fn version_action(ctx: Context<VersionAction>, args: VersionActionArgs) -> Result<()> {
        version_action_handler(ctx, args)
    }

    pub fn create_spawn(ctx: Context<CreateSpawn>, args: CreateSpawnArgs) -> Result<()> {
        create_spawn_handler(ctx, args)
    }

    pub fn update_spawn(ctx: Context<UpdateSpawn>, args: UpdateSpawnArgs) -> Result<()> {
        update_spawn_handler(ctx, args)
    }

    pub fn version_spawn(ctx: Context<VersionSpawn>, args: VersionSpawnArgs) -> Result<()> {
        version_spawn_handler(ctx, args)
    }

    pub fn create_item_part(ctx: Context<CreateItemPart>, args: CreateItemPartArgs) -> Result<()> {
        create_item_part_handler(ctx, args)
    }

    pub fn update_item_part(ctx: Context<UpdateItemPart>, args: UpdateItemPartArgs) -> Result<()> {
        update_item_part_handler(ctx, args)
    }

    pub fn version_item_part(
        ctx: Context<VersionItemPart>,
        args: VersionItemPartArgs,
    ) -> Result<()> {
        version_item_part_handler(ctx, args)
    }

    pub fn create_game(ctx: Context<CreateGame>) -> Result<()> {
        create_game_handler(ctx)
    }

    pub fn delegate_game(ctx: Context<DelegateGame>) -> Result<()> {
        delegate_game_handler(ctx)
    }

    pub fn run_game(ctx: Context<RunGame>) -> Result<()> {
        run_game_handler(ctx)
    }

    pub fn undelegate_game_game(ctx: Context<UndelegateGame>) -> Result<()> {
        undelegate_game_handler(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}

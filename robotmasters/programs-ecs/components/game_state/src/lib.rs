use bolt_lang::*;

declare_id!("5Bdg5zBdxRBSjYxnUkFshi2neQMmiSLHKYAWgkv6VNQQ");

#[component]
#[derive(Default)]
pub struct GameState {
    pub x: i64,
    pub y: i64,
    pub z: i64,
    #[max_len(20)]
    pub description: String,
}
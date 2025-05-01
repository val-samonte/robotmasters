use bolt_lang::*;
extern crate alloc;

declare_id!("5Bdg5zBdxRBSjYxnUkFshi2neQMmiSLHKYAWgkv6VNQQ");

#[derive(Clone, AnchorDeserialize, AnchorSerialize)]
pub struct GameData(pub Box<[u8; 800]>);

impl Space for GameData {
    const INIT_SPACE: usize = 800;
}

impl Default for GameData {
    fn default() -> Self {
        GameData(Box::new([0u8; 800]))
    }
}

#[component]
#[derive(Default)]
pub struct GameState {
    pub len: u16,
    pub shard_id: u8,
    pub data: GameData,
}

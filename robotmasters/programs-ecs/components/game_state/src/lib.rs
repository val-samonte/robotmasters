use bolt_lang::*;
use borsh::{BorshDeserialize, BorshSerialize};
extern crate alloc;

declare_id!("5Bdg5zBdxRBSjYxnUkFshi2neQMmiSLHKYAWgkv6VNQQ");

#[derive(Clone)]
pub struct GameData(pub Box<[u8; 3600]>);

impl Space for GameData {
    const INIT_SPACE: usize = 3600;
}

impl BorshSerialize for GameData {
    fn serialize<W: borsh::maybestd::io::Write>(
        &self,
        writer: &mut W,
    ) -> borsh::maybestd::io::Result<()> {
        self.0[..].serialize(writer)
    }
}

impl BorshDeserialize for GameData {
    fn deserialize_reader<R: borsh::maybestd::io::Read>(
        reader: &mut R,
    ) -> borsh::maybestd::io::Result<Self> {
        let bytes: [u8; 3600] = BorshDeserialize::deserialize_reader(reader)?;
        Ok(GameData(Box::new(bytes)))
    }
}

impl Default for GameData {
    fn default() -> Self {
        GameData(Box::new([0u8; 3600]))
    }
}

#[component]
#[derive(Default)]
pub struct GameState {
    pub len: u16,
    pub frame: u16,
    pub data: GameData,
}

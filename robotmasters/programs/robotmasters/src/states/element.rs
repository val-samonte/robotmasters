use bolt_lang::prelude::*;

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize)]
pub enum Element {
    Punct,
    Blast,
    Force,
    Sever,
    Heat,
    Cryo,
    Jolt,
    Virus,
}

impl Element {
    pub fn from_byte(value: u8) -> Option<Self> {
        match value {
            1 => Some(Element::Punct),
            2 => Some(Element::Blast),
            3 => Some(Element::Force),
            4 => Some(Element::Sever),
            5 => Some(Element::Heat),
            6 => Some(Element::Cryo),
            7 => Some(Element::Jolt),
            8 => Some(Element::Virus),
            _ => None,
        }
    }
    pub fn to_byte(&self) -> u8 {
        match self {
            Element::Punct => 1,
            Element::Blast => 2,
            Element::Force => 3,
            Element::Sever => 4,
            Element::Heat => 5,
            Element::Cryo => 6,
            Element::Jolt => 7,
            Element::Virus => 8,
        }
    }
}
